import os
import pickle
from django.conf import settings
from .models import Ratings

_svd_model = None

def load_svd_model():
    global _svd_model
    if _svd_model is None:
        model_path = os.path.join(settings.BASE_DIR.parent, 'ml', 'svd_model.pkl')
        if os.path.exists(model_path):
            with open(model_path, 'rb') as f:
                _svd_model = pickle.load(f)
    return _svd_model

def get_svd_recommendations(user_id, n=20):
    """
    Returns a list of recommended ASINs for the given dataset_user_id.
    """
    model = load_svd_model()
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

    # Find items the user has already rated using the database
    rated_asins = set(Ratings.objects.filter(user_id=user_id).values_list('parent_asin_id', flat=True))

    scores = []
    n_items = len(item_dec)
    for i in range(n_items):
        asin = item_dec[i]
        if asin not in rated_asins:
            scores.append((asin, user_ratings[i]))

    # Sort by highest predicted rating
    scores.sort(key=lambda x: x[1], reverse=True)
    
    # Return top N ASINs
    return [asin for asin, score in scores[:n]]
