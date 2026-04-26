"""
ml_service.py — Recommendation engine with threshold-based logic and explanations.

Threshold:
  0-2 ratings  → cold start (popular in preferred categories)
  3+  ratings  → hybrid (SVD + content-based + history-based)

Every recommendation returns: { 'product': <Products>, 'explanation': str, 'method': str }
"""

import logging
from .models import Products, Ratings, History, Users
from .ml_loader import get_svd_model, get_content_based_model

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────
# PUBLIC API
# ─────────────────────────────────────────────────────────────

def get_recommendations(user, n=20):
    """
    Main entry point. Returns a list of dicts:
      [{ 'product': <Products>, 'explanation': str, 'method': str }, ...]
    """
    dataset_user_id = user.dataset_user_id
    if not dataset_user_id:
        return _cold_start(user.preferred_categories, n)

    # Count user's ratings in the dataset
    ratings_count = Ratings.objects.filter(user_id=dataset_user_id).count()

    if ratings_count < 3:
        return _cold_start(user.preferred_categories, n)

    return _hybrid(user, dataset_user_id, n)


# ─────────────────────────────────────────────────────────────
# COLD START
# ─────────────────────────────────────────────────────────────

def _cold_start(preferred_categories, n=20):
    """Top-rated products filtered by preferred categories."""
    results = []

    if not preferred_categories:
        # Fallback: just top-rated overall
        products = _base_products_qs().order_by('-average_rating', '-rating_number')[:n]
        for p in products:
            results.append({
                'product': p,
                'explanation': 'Top rated in Beauty',
                'method': 'cold_start',
            })
        return results

    per_cat = max(n // len(preferred_categories), 4)

    for cat in preferred_categories:
        products = (
            _base_products_qs()
            .filter(main_category__icontains=cat)
            .order_by('-average_rating', '-rating_number')[:per_cat]
        )
        for p in products:
            results.append({
                'product': p,
                'explanation': f'Popular in {cat}',
                'method': 'cold_start',
            })

    # Deduplicate by asin, keep first occurrence
    seen = set()
    deduped = []
    for r in results:
        asin = r['product'].parent_asin
        if asin not in seen:
            seen.add(asin)
            deduped.append(r)
    return deduped[:n]


# ─────────────────────────────────────────────────────────────
# HYBRID (SVD + Content-Based + History)
# ─────────────────────────────────────────────────────────────

def _hybrid(user, dataset_user_id, n=20):
    """Combine SVD, content-based, and history-based recommendations."""
    results = []
    seen = set()

    # 1) SVD recommendations (60% of slots)
    svd_n = max(n * 6 // 10, 6)
    svd_recs = _svd_recommendations(dataset_user_id, svd_n)
    for r in svd_recs:
        asin = r['product'].parent_asin
        if asin not in seen:
            seen.add(asin)
            results.append(r)

    # 2) History-based / content-based (30% of slots)
    hist_n = max(n * 3 // 10, 4)
    hist_recs = _history_recommendations(user, hist_n)
    for r in hist_recs:
        asin = r['product'].parent_asin
        if asin not in seen:
            seen.add(asin)
            results.append(r)

    # 3) Fill remaining with cold-start (if needed)
    if len(results) < n:
        fill = _cold_start(user.preferred_categories, n - len(results))
        for r in fill:
            asin = r['product'].parent_asin
            if asin not in seen:
                seen.add(asin)
                results.append(r)

    return results[:n]


# ─────────────────────────────────────────────────────────────
# SVD
# ─────────────────────────────────────────────────────────────

def _svd_recommendations(user_id, n=12):
    """Get SVD-based collaborative filtering recommendations with explanations."""
    model = get_svd_model()
    if not model:
        return []

    user_enc = model.get('user_enc', {})
    if user_id not in user_enc:
        return []

    u_idx = user_enc[user_id]
    predicted_ratings = model.get('predicted_ratings')
    item_dec = model.get('item_dec', {})

    if predicted_ratings is None or not item_dec:
        return []

    user_ratings = predicted_ratings[u_idx]

    # Items user already rated
    rated_asins = set(
        Ratings.objects.filter(user_id=user_id)
        .values_list('parent_asin_id', flat=True)
    )

    # Find best-rated product for the explanation
    best_rated = (
        Ratings.objects
        .filter(user_id=user_id)
        .select_related('parent_asin')
        .order_by('-rating')
        .first()
    )
    best_title = best_rated.parent_asin.title[:40] if best_rated and best_rated.parent_asin else None
    best_rating = int(best_rated.rating) if best_rated else 5

    # Score all unrated items
    scores = []
    n_items = len(item_dec)
    for i in range(n_items):
        asin = item_dec[i]
        if asin not in rated_asins:
            scores.append((asin, float(user_ratings[i])))

    scores.sort(key=lambda x: x[1], reverse=True)
    top_asins = [asin for asin, _ in scores[:n]]

    # Fetch products
    products_map = {
        p.parent_asin: p
        for p in Products.objects.filter(parent_asin__in=top_asins)
    }

    results = []
    for asin in top_asins:
        product = products_map.get(asin)
        if product and product.image_url:
            if best_title:
                explanation = f'Because you rated "{best_title}" {best_rating} stars'
            else:
                explanation = 'Based on your ratings'
            results.append({
                'product': product,
                'explanation': explanation,
                'method': 'svd',
            })

    return results


# ─────────────────────────────────────────────────────────────
# HISTORY-BASED (content-based on recently viewed)
# ─────────────────────────────────────────────────────────────

def _history_recommendations(user, n=6):
    """Content-based recs derived from the user's last 5 viewed products."""
    recent_views = History.objects.filter(user=user).select_related('product')[:5]
    if not recent_views:
        return []

    cb = get_content_based_model()
    if not cb:
        return []

    results = []
    per_item = max(n // len(recent_views), 2)

    for entry in recent_views:
        ref_title = (entry.product.title or '')[:40]
        try:
            similar_df = cb.get_similar_products(entry.product.parent_asin, top_n=per_item)
            if similar_df is not None and not similar_df.empty:
                for _, row in similar_df.iterrows():
                    try:
                        product = Products.objects.get(parent_asin=row['parent_asin'])
                        if product.image_url:
                            results.append({
                                'product': product,
                                'explanation': f'Because you viewed "{ref_title}"',
                                'method': 'history',
                            })
                    except Products.DoesNotExist:
                        continue
        except Exception as e:
            logger.warning("Content-based error for %s: %s", entry.product.parent_asin, e)

    return results[:n]


# ─────────────────────────────────────────────────────────────
# CONTENT-BASED (for product detail page)
# ─────────────────────────────────────────────────────────────

def get_similar_products(product_asin, n=6):
    """Content-based similar products for the product detail page."""
    cb = get_content_based_model()

    # Get the reference product title
    try:
        ref_product = Products.objects.get(parent_asin=product_asin)
        ref_title = (ref_product.title or '')[:40]
    except Products.DoesNotExist:
        ref_title = 'this product'

    if cb:
        try:
            similar_df = cb.get_similar_products(product_asin, top_n=n)
            if similar_df is not None and not similar_df.empty:
                asins = similar_df['parent_asin'].tolist()
                products_map = {
                    p.parent_asin: p
                    for p in Products.objects.filter(parent_asin__in=asins)
                }
                results = []
                for asin in asins:
                    p = products_map.get(asin)
                    if p and p.image_url:
                        results.append({
                            'product': p,
                            'explanation': f'Similar to "{ref_title}"',
                            'method': 'content_based',
                        })
                return results[:n]
        except Exception as e:
            logger.warning("Content-based similar products error: %s", e)

    # Fallback: same category
    fallback = (
        _base_products_qs()
        .filter(main_category=ref_product.main_category)
        .exclude(parent_asin=product_asin)
        .order_by('-average_rating', '-rating_number')[:n]
    )
    return [
        {
            'product': p,
            'explanation': f'Same category as "{ref_title}"',
            'method': 'content_based',
        }
        for p in fallback
    ]


# ─────────────────────────────────────────────────────────────
# LEGACY API (kept for backward compatibility)
# ─────────────────────────────────────────────────────────────

def get_svd_recommendations(user_id, n=20):
    """Legacy: returns a flat list of ASINs. Used by existing code."""
    recs = _svd_recommendations(user_id, n)
    return [r['product'].parent_asin for r in recs]


# ─────────────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────────────

def _base_products_qs():
    """Base queryset excluding products without images."""
    return Products.objects.exclude(
        image_url__isnull=True
    ).exclude(
        image_url__exact=''
    )
