import pandas as pd

# ─────────────────────────────────────────────
# LOAD
# ─────────────────────────────────────────────
print("Loading files...")
reviews = pd.read_parquet(r"C:\Users\kenza\Desktop\pfa\processed\reviews_clean.parquet")
meta    = pd.read_parquet(r"C:\Users\kenza\Desktop\pfa\processed\metadata_clean.parquet")

print(f"Reviews loaded : {len(reviews)}")
print(f"Meta loaded    : {len(meta)}")

# ─────────────────────────────────────────────
# REDUCE — activity filter
# ─────────────────────────────────────────────
print("\nApplying activity filter...")

user_counts    = reviews.groupby('user_id')['rating'].count()
active_users   = user_counts[user_counts >= 5].index
reviews        = reviews[reviews['user_id'].isin(active_users)]
print(f"After user filter    : {len(reviews)}")

product_counts   = reviews.groupby('parent_asin')['rating'].count()
active_products  = product_counts[product_counts >= 5].index
reviews          = reviews[reviews['parent_asin'].isin(active_products)]
print(f"After product filter : {len(reviews)}")

print(f"Users    : {reviews['user_id'].nunique()}")
print(f"Products : {reviews['parent_asin'].nunique()}")

meta = meta[meta['parent_asin'].isin(reviews['parent_asin'].unique())]
print(f"Meta after filter    : {len(meta)}")

# ─────────────────────────────────────────────
# TABLE 1 — users
# ─────────────────────────────────────────────
users = pd.DataFrame({'user_id': reviews['user_id'].unique()})
print(f"\nTable users    : {len(users)} rows")

# ─────────────────────────────────────────────
# TABLE 2 — products
# ─────────────────────────────────────────────
desired_cols = [
    'parent_asin',
    'title',
    'main_category',
    'price',
    'store',
    'categories',
    'average_rating',
    'rating_number',
    'features',
    'description',
    'cb_text',
    'image_url'
]
available_cols = [c for c in desired_cols if c in meta.columns]
products = meta[available_cols].copy()
print(f"Table products : {len(products)} rows")
print(f"Columns kept   : {available_cols}")

# ─────────────────────────────────────────────
# TABLE 3 — ratings
# ─────────────────────────────────────────────
ratings_cols = [
    'user_id',
    'parent_asin',
    'rating',
    'timestamp',
    'review_date',
    'helpful_vote',
    'verified_purchase'
]
ratings = reviews[[c for c in ratings_cols if c in reviews.columns]].copy()
print(f"Table ratings  : {len(ratings)} rows")

# ─────────────────────────────────────────────
# TABLE 4 — reviews_text (for DistilBERT)
# ─────────────────────────────────────────────
reviews_text = reviews[[
    'user_id',
    'parent_asin',
    'text',
    'word_count'
]].copy()
reviews_text['sentiment_score'] = None
print(f"Table reviews  : {len(reviews_text)} rows")

# ─────────────────────────────────────────────
# SAVE
# ─────────────────────────────────────────────
output = r"C:\Users\kenza\Desktop\pfa\final"

users.to_csv(        f"{output}\\users.csv",        index=False)
products.to_csv(     f"{output}\\products.csv",     index=False)
ratings.to_csv(      f"{output}\\ratings.csv",      index=False)
reviews_text.to_csv( f"{output}\\reviews_text.csv", index=False)

print("\nAll 4 tables saved!")
print(f"  users.csv        → {len(users)} rows")
print(f"  products.csv     → {len(products)} rows  |  cols: {list(products.columns)}")
print(f"  ratings.csv      → {len(ratings)} rows")
print(f"  reviews_text.csv → {len(reviews_text)} rows")