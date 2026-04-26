"""
ml_loader.py — Singleton loader for all ML models.
Loads SVD + Content-Based once at import time and keeps them in memory.
"""

import os
import pickle
import logging
import sys

from django.conf import settings

logger = logging.getLogger(__name__)

# ─── SVD Model ───────────────────────────────────────────────
_svd_model = None


def get_svd_model():
    global _svd_model
    if _svd_model is None:
        model_path = os.path.join(settings.BASE_DIR.parent, 'ml', 'svd_model.pkl')
        if os.path.exists(model_path):
            try:
                with open(model_path, 'rb') as f:
                    _svd_model = pickle.load(f)
                logger.info("SVD model loaded from %s", model_path)
            except Exception as e:
                logger.error("Failed to load SVD model: %s", e)
        else:
            logger.warning("SVD model file not found at %s", model_path)
    return _svd_model


# ─── Content-Based Model ────────────────────────────────────
_cb_recommender = None


def get_content_based_model():
    """Returns a ready-to-use ContentBasedRecommender instance (or None)."""
    global _cb_recommender
    if _cb_recommender is None:
        try:
            # Add the ml/ directory to path so we can import
            ml_dir = os.path.join(settings.BASE_DIR.parent, 'ml')
            if ml_dir not in sys.path:
                sys.path.insert(0, ml_dir)

            from content_based import ContentBasedRecommender

            _cb_recommender = ContentBasedRecommender()
            _cb_recommender.load_data()
            _cb_recommender.build_model()
            logger.info("Content-based model loaded and built")
        except Exception as e:
            logger.error("Failed to load content-based model: %s", e)
    return _cb_recommender
