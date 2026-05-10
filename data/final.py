"""
prepare_data.py
───────────────
Script de préparation des données pour le système de recommandation PFA.
Génère 4 tables : users, products, ratings, reviews_text.

Usage :
    python prepare_data.py
    python prepare_data.py --base "D:/mon/autre/chemin/pfa"
"""

import argparse
import sys
import time
from pathlib import Path

import pandas as pd


# ─────────────────────────────────────────────────────────────
# CONFIGURATION  ← seul endroit à modifier si besoin
# ─────────────────────────────────────────────────────────────
DEFAULT_BASE = Path(r"C:\Users\pc\Desktop\pfa")

MIN_REVIEWS_PER_USER    = 5
MIN_REVIEWS_PER_PRODUCT = 5


# ─────────────────────────────────────────────────────────────
# UTILITAIRES
# ─────────────────────────────────────────────────────────────
def section(title: str) -> None:
    print(f"\n{'─' * 50}")
    print(f"  {title}")
    print(f"{'─' * 50}")


def check_paths(processed: Path, output: Path) -> None:
    """Vérifie que les fichiers source existent."""
    missing = []
    for f in [processed / "reviews_clean.parquet", processed / "metadata_clean.parquet"]:
        if not f.exists():
            missing.append(str(f))
    if missing:
        print("\n❌ Fichiers introuvables :")
        for m in missing:
            print(f"   {m}")
        print("\nVérifie que les fichiers parquet de Kenza sont bien copiés dans :")
        print(f"   {processed}")
        sys.exit(1)
    output.mkdir(parents=True, exist_ok=True)


# ─────────────────────────────────────────────────────────────
# CHARGEMENT
# ─────────────────────────────────────────────────────────────
def load_data(processed: Path) -> tuple[pd.DataFrame, pd.DataFrame]:
    section("CHARGEMENT DES FICHIERS")
    t0 = time.time()

    reviews = pd.read_parquet(processed / "reviews_clean.parquet")
    meta    = pd.read_parquet(processed / "metadata_clean.parquet")

    print(f"  reviews_clean.parquet → {len(reviews):>10,} lignes  |  {reviews['user_id'].nunique():,} users  |  {reviews['parent_asin'].nunique():,} produits")
    print(f"  metadata_clean.parquet→ {len(meta):>10,} lignes")
    print(f"  Chargé en {time.time() - t0:.1f}s")
    return reviews, meta


# ─────────────────────────────────────────────────────────────
# FILTRAGE (activité minimale)
# ─────────────────────────────────────────────────────────────
def apply_activity_filter(
    reviews: pd.DataFrame,
    meta: pd.DataFrame,
    min_user: int,
    min_product: int,
) -> tuple[pd.DataFrame, pd.DataFrame]:
    section("FILTRAGE PAR ACTIVITÉ")

    # Filtre utilisateurs
    user_counts  = reviews.groupby("user_id")["rating"].count()
    active_users = user_counts[user_counts >= min_user].index
    reviews      = reviews[reviews["user_id"].isin(active_users)]
    print(f"  Users  >= {min_user} avis  → {reviews['user_id'].nunique():,} users    ({len(reviews):,} lignes)")

    # Filtre produits
    prod_counts     = reviews.groupby("parent_asin")["rating"].count()
    active_products = prod_counts[prod_counts >= min_product].index
    reviews         = reviews[reviews["parent_asin"].isin(active_products)]
    print(f"  Produits >= {min_product} avis → {reviews['parent_asin'].nunique():,} produits ({len(reviews):,} lignes)")

    # Aligne les métadonnées
    meta = meta[meta["parent_asin"].isin(reviews["parent_asin"].unique())].copy()
    print(f"  Métadonnées alignées  → {len(meta):,} lignes")

    return reviews, meta


# ─────────────────────────────────────────────────────────────
# CONSTRUCTION DES TABLES
# ─────────────────────────────────────────────────────────────
def build_users(reviews: pd.DataFrame) -> pd.DataFrame:
    users = pd.DataFrame({"user_id": reviews["user_id"].unique()})
    print(f"  [users]        {len(users):>8,} lignes")
    return users


def build_products(meta: pd.DataFrame) -> pd.DataFrame:
    desired_cols = [
        "parent_asin",
        "title",
        "main_category",
        "price",
        "store",
        "categories",
        "average_rating",
        "rating_number",
        "features",
        "description",
        "cb_text",
        "image_url",
    ]
    available = [c for c in desired_cols if c in meta.columns]
    missing   = [c for c in desired_cols if c not in meta.columns]

    products = meta[available].copy()

    if missing:
        print(f"  ⚠  Colonnes absentes ignorées : {missing}")
    print(f"  [products]     {len(products):>8,} lignes  |  colonnes : {available}")
    return products


def build_ratings(reviews: pd.DataFrame) -> pd.DataFrame:
    desired_cols = [
        "user_id",
        "parent_asin",
        "rating",
        "timestamp",
        "review_date",
        "helpful_vote",
        "verified_purchase",
    ]
    available = [c for c in desired_cols if c in reviews.columns]
    ratings   = reviews[available].copy()
    print(f"  [ratings]      {len(ratings):>8,} lignes")
    return ratings


def build_reviews_text(reviews: pd.DataFrame) -> pd.DataFrame:
    base_cols = ["user_id", "parent_asin"]
    optional  = ["text", "title", "word_count"]
    cols      = base_cols + [c for c in optional if c in reviews.columns]

    reviews_text = reviews[cols].copy()
    reviews_text["sentiment_score"] = None   # sera rempli par DistilBERT
    reviews_text["sentiment_label"] = None   # Positive / Neutral / Negative
    print(f"  [reviews_text] {len(reviews_text):>8,} lignes  (sentiment_score/label = None, à remplir par DistilBERT)")
    return reviews_text


# ─────────────────────────────────────────────────────────────
# SAUVEGARDE
# ─────────────────────────────────────────────────────────────
def save_tables(
    output: Path,
    users: pd.DataFrame,
    products: pd.DataFrame,
    ratings: pd.DataFrame,
    reviews_text: pd.DataFrame,
) -> None:
    section("SAUVEGARDE")

    tables = {
        "users.csv":        users,
        "products.csv":     products,
        "ratings.csv":      ratings,
        "reviews_text.csv": reviews_text,
    }

    for filename, df in tables.items():
        path = output / filename
        df.to_csv(path, index=False, encoding="utf-8-sig")   # utf-8-sig = BOM, compatible Excel
        size_mb = path.stat().st_size / 1_048_576
        print(f"  ✔  {filename:<25} {len(df):>10,} lignes  ({size_mb:.1f} MB)")

    print(f"\n  Dossier de sortie : {output}")


# ─────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────
def main() -> None:
    parser = argparse.ArgumentParser(description="Prépare les 4 tables du PFA.")
    parser.add_argument(
        "--base",
        type=Path,
        default=DEFAULT_BASE,
        help=f"Chemin racine du projet (défaut : {DEFAULT_BASE})",
    )
    parser.add_argument(
        "--min-user",
        type=int,
        default=MIN_REVIEWS_PER_USER,
        help=f"Nombre minimum d'avis par utilisateur (défaut : {MIN_REVIEWS_PER_USER})",
    )
    parser.add_argument(
        "--min-product",
        type=int,
        default=MIN_REVIEWS_PER_PRODUCT,
        help=f"Nombre minimum d'avis par produit (défaut : {MIN_REVIEWS_PER_PRODUCT})",
    )
    args = parser.parse_args()

    processed = args.base / "processed"
    output    = args.base / "final"

    print(f"\n{'═' * 50}")
    print(f"  PFA — Préparation des données")
    print(f"{'═' * 50}")
    print(f"  Base      : {args.base}")
    print(f"  Processed : {processed}")
    print(f"  Output    : {output}")

    check_paths(processed, output)

    t_start = time.time()

    reviews, meta = load_data(processed)

    reviews, meta = apply_activity_filter(
        reviews, meta,
        min_user=args.min_user,
        min_product=args.min_product,
    )

    section("CONSTRUCTION DES TABLES")
    users        = build_users(reviews)
    products     = build_products(meta)
    ratings      = build_ratings(reviews)
    reviews_text = build_reviews_text(reviews)

    save_tables(output, users, products, ratings, reviews_text)

    print(f"\n{'═' * 50}")
    print(f"  ✅ Terminé en {time.time() - t_start:.1f}s")
    print(f"{'═' * 50}\n")


if __name__ == "__main__":
    main()