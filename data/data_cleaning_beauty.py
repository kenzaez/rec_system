"""

input :
    - All_Beauty.jsonl         
    - meta_All_Beauty.jsonl     

output :
    - reviews_clean.parquet
    - metadata_clean.parquet
    - merged_clean.parquet
    - cleaning_report.txt
"""

import json
import re
import os
import logging
from pathlib import Path
from datetime import datetime

import pandas as pd
import numpy as np



RAW_DIR = Path(r"C:\Users\kenza\Desktop\pfa")
OUTPUT_DIR = Path(r"C:\Users\kenza\Desktop\pfa\processed")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

REVIEWS_FILE  = RAW_DIR / "All_Beauty.jsonl"
METADATA_FILE = RAW_DIR / "meta_All_Beauty.jsonl"

MIN_REVIEW_LENGTH = 10  
MAX_REVIEW_LENGTH = 5000 
VALID_RATINGS     = {1.0, 2.0, 3.0, 4.0, 5.0}

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)

report_lines = []


def report(msg: str):
    log.info(msg)
    report_lines.append(msg)


# loading and snapshot 


def load_jsonl(filepath: Path) -> pd.DataFrame:
    """Charge un fichier .jsonl ligne par ligne (robuste aux lignes malformées)."""
    records, errors = [], 0
    with open(filepath, "r", encoding="utf-8") as f:
        for i, line in enumerate(f):
            line = line.strip()
            if not line:
                continue
            try:
                records.append(json.loads(line))
            except json.JSONDecodeError:
                errors += 1
    report(f"  [{filepath.name}] {len(records):,} lignes chargées, {errors} erreurs JSON ignorées")
    return pd.DataFrame(records)


def snapshot(df: pd.DataFrame, label: str):
    """quick dataframe summary"""
    report(f"  SNAPSHOT : {label}")
    report(f"  Lignes   : {len(df):,}")
    report(f"  Colonnes : {list(df.columns)}")
    null_counts = df.isnull().sum()
    nulls = null_counts[null_counts > 0]
    if not nulls.empty:
        report(f"  Nulls    :\n{nulls.to_string()}")












# -----------------------------------------------------------------------------------
# REVIEWS CLEANING

def clean_reviews(df: pd.DataFrame) -> pd.DataFrame:
    """
    Nettoyage complet du fichier de reviews
    les etapes :
    - select use
    - Suppression des doublons
    - Nettoyage des ratings invalides
    - Nettoyage du texte des reviews
    - Gestion des valeurs manquantes
    - Conversion des types
    - Feature engineering de base
    """
 
    report("  cleaning : Reviews ")
    initial_count = len(df)
    snapshot(df, "Reviews brutes")

    # select only the useful columns
    
    cols_needed = [
       "user_id",        # collaborative filtering
    "parent_asin",    # join key
    "rating",         # collaborative filtering
    "text",           # BERT fine-tuning
    "timestamp",      # when, temporal trends
    "helpful_vote",   # review quality weight
    "verified_purchase"  # filter fake reviews

    ]
    # new dataframe
    df = df[cols_needed].copy()
  

    #  2-suppression des doublons 

    
    before = len(df)
    
    df = df.drop_duplicates(subset=["user_id", "parent_asin"], keep="last")
    report(f"  Doublons supprimes     : {before - len(df):,}")

    # 3-Ratings 
    if "rating" in df.columns:
        df["rating"] = pd.to_numeric(df["rating"], errors="coerce")
        before = len(df)
        df = df[df["rating"].isin(VALID_RATINGS)]
        report(f"  Ratings invalides supprimes : {before - len(df):,}")
        df["rating"] = df["rating"].astype(float)

    #  4- nettoyage du texte 
    def clean_text(text):
        if not isinstance(text, str):
            return np.nan
        text = text.strip()
        text = re.sub(r"<[^>]+>", " ", text)
        text = re.sub(r"\s+", " ", text)
        text = re.sub(r"[\x00-\x1f\x7f]", "", text)
        return text.strip() if text.strip() else np.nan

    if "text" in df.columns:
        df["text"] = df["text"].apply(clean_text)
        df["title_review"] = df.get("title", pd.Series(dtype=str)).apply(clean_text)

        # Filtrage par longueur (trop court = spam/inutile, trop long = outlier)
        before = len(df)
        df["text_len"] = df["text"].str.len().fillna(0)
        df = df[
            (df["text"].notna()) &
            (df["text_len"] >= MIN_REVIEW_LENGTH) &
            (df["text_len"] <= MAX_REVIEW_LENGTH)
        ]
        report(f"  Reviews hors longueur [<{MIN_REVIEW_LENGTH} / >{MAX_REVIEW_LENGTH}] : {before - len(df):,}")

    # 5- Valeurs manquantes 
    for col in ["user_id", "parent_asin"]:
        if col in df.columns:
            before = len(df)
            df = df[df[col].notna() & (df[col] != "")]
            report(f"  Lignes sans {col} supprimees : {before - len(df):,}")

    if "helpful_vote" in df.columns:
        df["helpful_vote"] = pd.to_numeric(df["helpful_vote"], errors="coerce").fillna(0).astype(int)

    if "verified_purchase" in df.columns:
        df["verified_purchase"] = df["verified_purchase"].fillna(False).astype(bool)

    # 6- Conversion timestamp 
    if "timestamp" in df.columns:
        # Reviews utilise des timestamps en millisecondes
        df["timestamp"] = pd.to_numeric(df["timestamp"], errors="coerce")
        df["review_date"] = pd.to_datetime(df["timestamp"], unit="ms", errors="coerce")
        df["review_year"]  = df["review_date"].dt.year
        df["review_month"] = df["review_date"].dt.month
        # Suppression des dates aberrantes (avant 2000 ou dans le futur)
        current_year = datetime.now().year
        df = df[
            df["review_year"].between(2000, current_year, inclusive="both") |
            df["review_year"].isna()
        ]

    #  7- Feature engineering de base 
        df["word_count"] = df["text"].str.split().str.len()


    #  Rapport final 
    report(f"\n  Reviews : {initial_count:,} → {len(df):,} (−{initial_count - len(df):,})")
    report(f"  Distribution des ratings :\n{df['rating'].value_counts().sort_index().to_string()}")

    return df.reset_index(drop=True)







# -----------------------------------------------------------------------------------------------------
# 2. CLEANING OF METADATA 


def clean_metadata(df: pd.DataFrame) -> pd.DataFrame:
  
    report("  CLEANING : metadonnes produits (meta_All_Beauty.jsonl)")
    initial_count = len(df)
    snapshot(df, "metadonnees brutes")

    # 1.Colonnes utiles 
    cols_needed = [
        "parent_asin", "title", "main_category", "categories",
        "price", "average_rating", "rating_number",
        "features", "description", "store", "details", "images"  # ← add images
    ]
  
    df = df[cols_needed].copy()

    # 2. primary key

    before = len(df)
    # 3. Price
    before = len(df)
    df = df.drop_duplicates(subset=['parent_asin'], keep="first")
    report(f"  Produits en double supprimes : {before - len(df):,}")

    def parse_price(val):
        if isinstance(val, (int, float)):
            return float(val) if val > 0 else np.nan
        if isinstance(val, str):
            cleaned = re.sub(r"[^\d.,]", "", val.replace(",", "."))
            first = cleaned.split()[0] if " " in cleaned else cleaned
            try:
                price = float(first)
                return price if price > 0 else np.nan
            except (ValueError, IndexError):
                return np.nan
        return np.nan

    df["price"] = df["price"].apply(parse_price)
    null_price = df["price"].isna().sum()
    report(f"  Prix non parsés (NaN) : {null_price:,} / {len(df):,}")
    df["categories_str"] = df["categories"].apply(
    lambda x: str(x[0]) if isinstance(x, list) and len(x) > 0 else "Unknown"
)

    df["price"] = df.groupby("categories_str")["price"].transform(
        lambda x: x.fillna(x.median())
    )
    report(f"  Prix imputés par médiane catégorie")

    df = df.drop(columns=["categories_str"])
     
    # ── 4. Titre du produit ───────────────────────────────────────
    def clean_product_title(val):
        if not isinstance(val, str):
            return np.nan
        val = val.strip()
        val = re.sub(r"<[^>]+>", " ", val)
        val = re.sub(r"\s+", " ", val)
        return val.strip() if val.strip() else np.nan

    if "title" in df.columns:
        df["title"] = df["title"].apply(clean_product_title)
        missing_titles = df["title"].isna().sum()
        report(f"  Produits sans titre : {missing_titles:,}")

    #  5. Description and features 
    def list_to_text(val):

        if isinstance(val, list):
            text = " ".join(str(x) for x in val if x)
        elif isinstance(val, str):
            text = val
        else:
            return np.nan
        text = re.sub(r"<[^>]+>", " ", text)
        text = re.sub(r"\s+", " ", text).strip()
        return text if text else np.nan

    if "description" in df.columns:
        df["description"] = df["description"].apply(list_to_text)

    if "features" in df.columns:
        df["features"] = df["features"].apply(list_to_text)

    # content based filtering 
    text_cols_cb = ["title", "description", "features"]
    available_text_cols = [c for c in text_cols_cb if c in df.columns]
    if available_text_cols:
        df["cb_text"] = df[available_text_cols].fillna("").agg(" ".join, axis=1)
        df["cb_text"] = df["cb_text"].str.strip().replace("", np.nan)

    # 6. Categories 
    def extract_main_cat(val):
        if isinstance(val, list) and len(val) > 0:
            return str(val[0]).strip()
        if isinstance(val, str):
            return val.strip()
        return np.nan
    if "images" in df.columns:
        def extract_thumb(val):
            if isinstance(val, list) and len(val) > 0:
                return val[0].get('thumb', np.nan) if isinstance(val[0], dict) else np.nan
            return np.nan
        df["image_url"] = df["images"].apply(extract_thumb)
        df = df.drop(columns=["images"])
    if "categories" in df.columns:
        df["category_main"] = df["categories"].apply(extract_main_cat)

    if "main_category" in df.columns:
        df["main_category"] = df["main_category"].fillna(
            df.get("category_main", pd.Series(dtype=str))
        )

    # 7. Ratings 
    if "average_rating" in df.columns:
        df["average_rating"] = pd.to_numeric(df["average_rating"], errors="coerce")
        df = df[df["average_rating"].between(1.0, 5.0, inclusive="both") | df["average_rating"].isna()]

    if "rating_number" in df.columns:
        df["rating_number"] = pd.to_numeric(df["rating_number"], errors="coerce").fillna(0).astype(int)

    report(f"\n  metadonnes : {initial_count:,} → {len(df):,} (−{initial_count - len(df):,})")

    return df.reset_index(drop=True)




# =============================================================================
# 4. STATISTIQUES FINALES & RAPPORT
# =============================================================================

def final_stats(reviews: pd.DataFrame, metadata: pd.DataFrame):
    report("\n" + "-"*60)
    report("  STATISTIQUES FINALES")
    report("-"*60)
    report(f"  Reviews propres        : {len(reviews):,}")
    report(f"  Produits propres       : {len(metadata):,}")

    if "rating" in reviews.columns:
        report(f"\n  Ratings — mean  : {reviews['rating'].mean():.3f}")
        report(f"  Ratings — std   : {reviews['rating'].std():.3f}")
        report(f"  Ratings — médiane : {reviews['rating'].median():.1f}")

    if "word_count" in reviews.columns:
        report(f"\n  Longueur reviews (mots) :")
        report(f"    min : {reviews['word_count'].min()}")
        report(f"    mean: {reviews['word_count'].mean():.1f}")
        report(f"    max : {reviews['word_count'].max()}")

    if "price_filled" in metadata.columns:
        report(f"\n  Prix produits (USD) :")
        report(f"    min : {metadata['price_filled'].min():.2f}")
        report(f"    mean: {metadata['price_filled'].mean():.2f}")
        report(f"    max : {metadata['price_filled'].max():.2f}")

    if "user_id" in reviews.columns:
        n_users    = reviews["user_id"].nunique()
    n_products = reviews["parent_asin"].nunique()
    report(f"  Produits uniques     : {n_products:,}")
    report(f"  Produits uniques     : {n_products:,}")
    if isinstance(n_products, int) and n_products > 0:
            sparsity = 1 - len(reviews) / (n_users * n_products)
            report(f"  Sparsité matrice U×P : {sparsity:.4f} ({sparsity*100:.2f}%)")


# =============================================================================
# 5. SAUVEGARDE
# =============================================================================

def save_outputs(
    reviews: pd.DataFrame,
    metadata: pd.DataFrame
):
    """Sauvegarde en Parquet (recommandé) et CSV optionnel."""
    report("\n" + "="*60)
    report("  SAUVEGARDE")
    report("="*60)

    # Parquet — format optimal pour pandas + spark
    reviews.to_parquet(OUTPUT_DIR / "reviews_clean.parquet", index=False)
    metadata.to_parquet(OUTPUT_DIR / "metadata_clean.parquet", index=False)
    report(f"  reviews_clean.parquet    ({len(reviews):,} lignes)")
    report(f"  metadata_clean.parquet   ({len(metadata):,} lignes)")
  
   

    # Rapport texte
    report_path = OUTPUT_DIR / "cleaning_report.txt"
    with open(report_path, "w", encoding="utf-8") as f:
        f.write("\n".join(report_lines))
    report(f"  cleaning_report.txt")

    report(f"\n  Tout sauvegardé dans : {OUTPUT_DIR.resolve()}")


# =============================================================================
# MAIN
# =============================================================================

def main():
    report("-" * 60)
    report("  DATA CLEANING PIPELINE ")
    report(f"  demarrage : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    report("-" * 60)

    # Chargement
    report("\n chargement des fichiers")
    df_reviews  = load_jsonl(REVIEWS_FILE)
    df_metadata = load_jsonl(METADATA_FILE)

    # Cleaning
    report("\n  nettoyage des reviews")
    reviews_clean = clean_reviews(df_reviews)

    report("\n  Nettoyage des metadonnees")
    metadata_clean = clean_metadata(df_metadata)



    # Stats finales
    final_stats(reviews_clean, metadata_clean)

    # Sauvegarde
    report("\n sauvegarde")
    save_outputs(reviews_clean, metadata_clean)

    report(f"\n  FIN : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    report("-" * 60)


if __name__ == "__main__":
    main()
