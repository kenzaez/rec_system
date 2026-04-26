import json
import uuid
from decimal import Decimal
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Q
from django.core.paginator import Paginator
from django.utils import timezone

from .models import Products, Ratings, ReviewsText, Users, AppUser, History, Order, OrderItem
from .ml_service import get_recommendations, get_similar_products


# ─────────────────────────────────────────────
# AUTH
# ─────────────────────────────────────────────
DEMO_USER_ID = 'AG73BVBKUOH22USSFJA5ZWL7AKXA'
def login_view(request):
    if request.user.is_authenticated:
        return redirect('index')

    if request.method == 'POST':
        email    = request.POST.get('email', '').strip()
        password = request.POST.get('password', '')
         # demo login
        if request.POST.get('demo'):
            app_user, created = AppUser.objects.get_or_create(
                dataset_user_id=DEMO_USER_ID,
                defaults={
                    'username': 'demo_user',
                    'email': 'demo@beautyrec.com',
                }
            )
            app_user.backend = 'django.contrib.auth.backends.ModelBackend'
            login(request, app_user)
            return redirect('index')

        try:
            user_obj = AppUser.objects.get(email=email)
            user = authenticate(request, username=user_obj.username, password=password)
        except AppUser.DoesNotExist:
            user = None

        if user is not None:
            login(request, user)
            if not user.dataset_user_id:
                return redirect('onboarding')
            return redirect('index')
        else:
            messages.error(request, 'Invalid email or password.')

    return render(request, 'login.html')


def register_view(request):
    if request.user.is_authenticated:
        return redirect('index')

    if request.method == 'POST':
        first_name = request.POST.get('first_name', '').strip()
        last_name  = request.POST.get('last_name', '').strip()
        email      = request.POST.get('email', '').strip()
        password   = request.POST.get('password', '')
        password2  = request.POST.get('password2', '')

        if password != password2:
            messages.error(request, 'Passwords do not match.')
            return render(request, 'register.html')

        if len(password) < 8:
            messages.error(request, 'Password must be at least 8 characters.')
            return render(request, 'register.html')

        if AppUser.objects.filter(email=email).exists():
            messages.error(request, 'An account with this email already exists.')
            return render(request, 'register.html')

        user = AppUser.objects.create_user(
            username   = email,
            email      = email,
            password   = password,
            first_name = first_name,
            last_name  = last_name,
        )
        login(request, user)
        return redirect('onboarding')

    return render(request, 'register.html')


def logout_view(request):
    logout(request)
    return redirect('login')


# ─────────────────────────────────────────────
# ONBOARDING (category-based)
# ─────────────────────────────────────────────

@login_required
def onboarding_view(request):
    if request.method == 'POST':
        raw = request.POST.get('categories', '[]')
        try:
            categories = json.loads(raw)
        except json.JSONDecodeError:
            messages.error(request, 'Something went wrong, please try again.')
            return redirect('onboarding')

        if not categories or len(categories) < 1:
            messages.error(request, 'Please select at least one category.')
            return redirect('onboarding')

        # Save preferred categories
        request.user.preferred_categories = categories

        # Generate dataset user ID
        new_user_id = 'USR_' + str(uuid.uuid4()).replace('-', '')[:16].upper()
        Users.objects.get_or_create(user_id=new_user_id)
        request.user.dataset_user_id = new_user_id
        request.user.save()

        return redirect('index')

    return render(request, 'onboarding.html')


# ─────────────────────────────────────────────
# INDEX (home page with recommendations + inline search)
# ─────────────────────────────────────────────

@login_required
def index_view(request):
    search_query = request.GET.get('q', '').strip()
    category_filter = request.GET.get('category', 'all')
    sort_by = request.GET.get('sort', 'relevance')
    min_rating = request.GET.get('min_rating', '')

    # ── Search mode ──
    if search_query:
        queryset = Products.objects.exclude(
            image_url__isnull=True
        ).exclude(
            image_url__exact=''
        ).filter(
            Q(title__icontains=search_query) |
            Q(main_category__icontains=search_query) |
            Q(store__icontains=search_query)
        )

        # Category filter
        if category_filter and category_filter != 'all':
            queryset = queryset.filter(main_category__icontains=category_filter)

        # Min rating filter
        if min_rating:
            try:
                queryset = queryset.filter(average_rating__gte=float(min_rating))
            except ValueError:
                pass

        # Sorting
        if sort_by == 'top_rated':
            queryset = queryset.order_by('-average_rating', '-rating_number')
        elif sort_by == 'most_reviewed':
            queryset = queryset.order_by('-rating_number', '-average_rating')
        elif sort_by == 'price-low':
            queryset = queryset.order_by('price')
        elif sort_by == 'price-high':
            queryset = queryset.order_by('-price')
        else:
            queryset = queryset.order_by('-rating_number')

        paginator = Paginator(queryset, 20)
        page_number = request.GET.get('page', 1)
        page_obj = paginator.get_page(page_number)

        context = {
            'products': page_obj.object_list,
            'recommendations': None,  # No recommendation badges in search mode
            'has_next_page': page_obj.has_next(),
            'next_page': page_obj.next_page_number() if page_obj.has_next() else None,
            'products_count': paginator.count,
            'search_query': search_query,
            'category_filter': category_filter,
            'sort_by': sort_by,
            'min_rating': min_rating,
            'is_search': True,
            'user_favourites': request.session.get('favourites', []),
        }
        return render(request, 'index.html', context)

    # ── Recommendation mode ──
    recs = get_recommendations(request.user, n=20)
    rec_products = [r['product'] for r in recs]
    rec_asins = [p.parent_asin for p in rec_products]
    rec_map = {r['product'].parent_asin: r for r in recs}

    # Get all other products
    other_products_qs = Products.objects.exclude(
        image_url__isnull=True
    ).exclude(
        image_url__exact=''
    ).exclude(
        parent_asin__in=rec_asins
    ).order_by('-rating_number')

    paginator = Paginator(other_products_qs, 20)
    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)

    # Combine on first page
    display_products = list(page_obj.object_list)
    if str(page_number) == '1':
        display_products = rec_products + display_products

    context = {
        'products': display_products,
        'rec_map': rec_map,
        'has_next_page': page_obj.has_next(),
        'next_page': page_obj.next_page_number() if page_obj.has_next() else None,
        'products_count': paginator.count + len(rec_products),
        'search_query': '',
        'is_search': False,
        'user_favourites': request.session.get('favourites', []),
    }

    return render(request, 'index.html', context)


# ─────────────────────────────────────────────
# PRODUCT DETAIL
# ─────────────────────────────────────────────

@login_required
def product_view(request, product_id):
    product = get_object_or_404(Products, parent_asin=product_id)

    # ── Record in History ──
    History.objects.update_or_create(
        user=request.user,
        product=product,
        defaults={'viewed_at': timezone.now()},
    )
    # Enforce max 20 entries
    user_history = History.objects.filter(user=request.user).order_by('-viewed_at')
    if user_history.count() > 20:
        old_ids = list(user_history.values_list('pk', flat=True)[20:])
        History.objects.filter(pk__in=old_ids).delete()

    # ── Similar products (content-based) ──
    similar_recs = get_similar_products(product_id, n=4)
    similar_products = [r['product'] for r in similar_recs]
    similar_explanations = {r['product'].parent_asin: r['explanation'] for r in similar_recs}

    # ── User rating for this product ──
    user_rating = None
    if request.user.dataset_user_id:
        try:
            existing = Ratings.objects.filter(
                user_id=request.user.dataset_user_id,
                parent_asin=product,
            ).first()
            if existing:
                user_rating = int(existing.rating)
        except Exception:
            pass

    context = {
        'product': product,
        'similar_products': similar_products,
        'similar_explanations': similar_explanations,
        'user_rating': user_rating,
    }

    return render(request, 'product.html', context)


# ─────────────────────────────────────────────
# RATE PRODUCT
# ─────────────────────────────────────────────

@login_required
def rate_product_view(request, product_id):
    if request.method == 'POST':
        product = get_object_or_404(Products, parent_asin=product_id)
        rating_value = request.POST.get('rating', '')

        try:
            rating_value = float(rating_value)
            if rating_value < 1 or rating_value > 5:
                raise ValueError
        except ValueError:
            messages.error(request, 'Please select a valid rating.')
            return redirect('product', product_id=product_id)

        dataset_user_id = request.user.dataset_user_id
        if not dataset_user_id:
            messages.error(request, 'Please complete onboarding first.')
            return redirect('onboarding')

        user_obj = Users.objects.get(user_id=dataset_user_id)

        # Update or create rating
        existing = Ratings.objects.filter(user=user_obj, parent_asin=product).first()
        if existing:
            existing.rating = rating_value
            existing.review_date = timezone.now()
            existing.save()
            messages.success(request, 'Rating updated!')
        else:
            Ratings.objects.create(
                user=user_obj,
                parent_asin=product,
                rating=rating_value,
                review_date=timezone.now(),
                verified_purchase=False,
            )
            messages.success(request, 'Rating submitted!')

    return redirect('product', product_id=product_id)


# ─────────────────────────────────────────────
# CART
# ─────────────────────────────────────────────

@login_required
def cart_view(request):
    # Get cart from session
    cart = request.session.get('cart', {})
    cart_items = []
    subtotal = 0

    for product_id, quantity in cart.items():
        try:
            product = Products.objects.get(parent_asin=product_id)
            price = product.price or 0
            item_total = price * quantity
            subtotal += item_total
            cart_items.append({
                'product': product,
                'quantity': quantity,
                'total': round(item_total, 2),
            })
        except Products.DoesNotExist:
            continue

    shipping_total = 0 if subtotal > 50 else 5
    total = round(subtotal + shipping_total, 2)

    context = {
        'cart_items': cart_items,
        'subtotal': round(subtotal, 2),
        'shipping_total': shipping_total,
        'total': total,
    }

    return render(request, 'cart.html', context)


@login_required
def add_to_cart_view(request, product_id):
    if request.method == 'POST':
        cart = request.session.get('cart', {})
        cart[product_id] = cart.get(product_id, 0) + 1
        request.session['cart'] = cart
        messages.success(request, 'Product added to cart.')

    return redirect('cart')


@login_required
def remove_from_cart_view(request, product_id):
    if request.method == 'POST':
        cart = request.session.get('cart', {})
        if product_id in cart:
            del cart[product_id]
            request.session['cart'] = cart
            messages.success(request, 'Product removed from cart.')

    return redirect('cart')


# ─────────────────────────────────────────────
# CHECKOUT
# ─────────────────────────────────────────────

@login_required
def checkout_view(request):
    cart = request.session.get('cart', {})
    if not cart:
        messages.error(request, 'Your cart is empty.')
        return redirect('cart')

    # Build cart items
    cart_items = []
    subtotal = Decimal('0')
    for product_id, quantity in cart.items():
        try:
            product = Products.objects.get(parent_asin=product_id)
            price = Decimal(str(product.price or 0))
            item_total = price * quantity
            subtotal += item_total
            cart_items.append({
                'product': product,
                'quantity': quantity,
                'total': item_total,
                'price': price,
            })
        except Products.DoesNotExist:
            continue

    shipping = Decimal('0') if subtotal > 50 else Decimal('5')
    total = subtotal + shipping

    if request.method == 'POST':
        full_name = request.POST.get('full_name', '').strip()
        email = request.POST.get('email', '').strip()
        address = request.POST.get('address', '').strip()
        city = request.POST.get('city', '').strip()
        state = request.POST.get('state', '').strip()
        zip_code = request.POST.get('zip_code', '').strip()

        if not all([full_name, email, address, city, state, zip_code]):
            messages.error(request, 'Please fill in all fields.')
        else:
            # Create order
            order = Order.objects.create(
                user=request.user,
                full_name=full_name,
                email=email,
                address=address,
                city=city,
                state=state,
                zip_code=zip_code,
                subtotal=subtotal,
                shipping=shipping,
                total=total,
                status='confirmed',
            )

            for item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    product=item['product'],
                    quantity=item['quantity'],
                    price=item['price'],
                )

            # Clear cart
            request.session['cart'] = {}
            messages.success(request, f'Order #{order.pk} placed successfully!')
            return redirect('order_confirmation', order_id=order.pk)

    context = {
        'cart_items': cart_items,
        'subtotal': subtotal,
        'shipping': shipping,
        'total': total,
    }
    return render(request, 'checkout.html', context)


@login_required
def order_confirmation_view(request, order_id):
    order = get_object_or_404(Order, pk=order_id, user=request.user)
    context = {
        'order': order,
        'order_items': order.items.select_related('product').all(),
    }
    return render(request, 'order_confirmation.html', context)


# ─────────────────────────────────────────────
# FAVOURITES
# ─────────────────────────────────────────────

@login_required
def favourites_view(request):
    favourites = request.session.get('favourites', [])
    favourite_products = Products.objects.filter(
        parent_asin__in=favourites
    ).exclude(
        image_url__isnull=True
    ).exclude(
        image_url__exact=''
    )

    context = {
        'favourite_products': favourite_products,
    }

    return render(request, 'favourites.html', context)


@login_required
def toggle_favourite_view(request, product_id):
    if request.method == 'POST':
        favourites = request.session.get('favourites', [])

        if product_id in favourites:
            favourites.remove(product_id)
            messages.success(request, 'Removed from favourites.')
        else:
            favourites.append(product_id)
            messages.success(request, 'Added to favourites.')

        request.session['favourites'] = favourites

    # Redirect back to the referring page or favourites
    referer = request.META.get('HTTP_REFERER', '')
    if 'product' in referer:
        return redirect(referer)
    return redirect('favourites')


# ─────────────────────────────────────────────
# PROFILE
# ─────────────────────────────────────────────

@login_required
def profile_view(request):
    user = request.user

    # Get user reviews
    user_reviews = []
    user_ratings_qs = Ratings.objects.none()
    try:
        if user.dataset_user_id:
            user_obj = Users.objects.get(user_id=user.dataset_user_id)
            user_reviews = ReviewsText.objects.filter(user=user_obj).select_related('parent_asin')
            user_ratings_qs = Ratings.objects.filter(user=user_obj).select_related('parent_asin')
    except Users.DoesNotExist:
        pass

    # Recommended products (from recommendation engine)
    recs = get_recommendations(user, n=6)
    recommended_products = recs

    # Wishlist
    favourites = request.session.get('favourites', [])
    wishlist_products = Products.objects.filter(
        parent_asin__in=favourites
    ).exclude(
        image_url__isnull=True
    ).exclude(
        image_url__exact=''
    )

    # History (from History model)
    viewing_history = History.objects.filter(user=user).select_related('product')[:20]

    context = {
        'favourites_count': len(favourites),
        'reviews_count': len(user_reviews) if hasattr(user_reviews, '__len__') else user_reviews.count(),
        'recommended_products': recommended_products,
        'wishlist_products': wishlist_products,
        'viewing_history': viewing_history,
        'user_reviews': user_reviews,
        'user_ratings': user_ratings_qs[:10],
    }

    return render(request, 'profile.html', context)


# ─────────────────────────────────────────────
# CHATBOT
# ─────────────────────────────────────────────

@login_required
def chatbot_view(request):
    chat_history = request.session.get('chat_history', [])

    context = {
        'chat_history': chat_history,
    }

    return render(request, 'chatbot.html', context)


@login_required
def chatbot_send_view(request):
    if request.method == 'POST':
        message = request.POST.get('message', '').strip()

        if message:
            chat_history = request.session.get('chat_history', [])
            chat_history.append({'role': 'user', 'text': message})

            # Simple bot response
            bot_response = "Thanks for your message! How can I help you further?"
            chat_history.append({'role': 'bot', 'text': bot_response})

            request.session['chat_history'] = chat_history

    return redirect('chatbot')