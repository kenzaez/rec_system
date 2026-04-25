import pandas as pd
import numpy as np
from sqlalchemy import create_engine
from scipy.sparse import csr_matrix
from sklearn.neighbors import NearestNeighbors
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error
import warnings
warnings.filterwarnings('ignore')

DB_CONFIG = {
    "host":     "localhost",
    "port":     5432,
    "database": "pfa_db",
    "user":     "pfa_user",
    "password": "pfa_pass"
}

engine = create_engine(
    f"postgresql://{DB_CONFIG['user']}:{DB_CONFIG['password']}"
    f"@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}"
)

print("1. loading data")

query = """
    SELECT user_id, parent_asin, rating
    FROM ratings
    WHERE rating IS NOT NULL
"""
df = pd.read_sql(query, engine)
print(f"got {len(df)} rows")
print(f"{df['user_id'].nunique()} users, {df['parent_asin'].nunique()} items")

print("2. filtering")

MIN_USER_RATINGS = 2
MIN_ITEM_RATINGS = 5

user_counts = df['user_id'].value_counts()
item_counts = df['parent_asin'].value_counts()

df = df[
    df['user_id'].isin(user_counts[user_counts >= MIN_USER_RATINGS].index) &
    df['parent_asin'].isin(item_counts[item_counts >= MIN_ITEM_RATINGS].index)
]

print(f"after filter: {len(df)} rows, {df['user_id'].nunique()} users, {df['parent_asin'].nunique()} items")

print("building matrix")

user_enc = {u: i for i, u in enumerate(df['user_id'].unique())}
item_enc = {p: i for i, p in enumerate(df['parent_asin'].unique())}
item_dec = {i: p for p, i in item_enc.items()}

df['user_idx'] = df['user_id'].map(user_enc)
df['item_idx'] = df['parent_asin'].map(item_enc)

n_users = len(user_enc)
n_items = len(item_enc)

sparse_matrix = csr_matrix(
    (df['rating'].values, (df['item_idx'].values, df['user_idx'].values)),
    shape=(n_items, n_users)
)

sparsity = 1 - (len(df) / (n_users * n_items))
print(f"matrix shape: {n_items} x {n_users}, sparsity: {sparsity:.2%}")

print("training KNN model")

K = 10

model_knn = NearestNeighbors(
    n_neighbors=K + 1,
    metric='cosine',
    algorithm='brute',
    n_jobs=-1
)
model_knn.fit(sparse_matrix)
print("done, K =", K)


def get_similar_items(asin, n=10):
    if asin not in item_enc:
        print(f"item {asin} not found")
        return 0

    item_idx = item_enc[asin]
    item_vec = sparse_matrix[item_idx]

    distances, indices = model_knn.kneighbors(item_vec, n_neighbors=n + 1)

    results = []
    for dist, idx in zip(distances.flatten()[1:], indices.flatten()[1:]):
        results.append({
            'asin': item_dec[idx],
            'similarity': round(1 - dist, 4),
        })

    return pd.DataFrame(results).sort_values('similarity', ascending=False)


def recommend_for_user(user_id, n=10):
    if user_id not in user_enc:
        print(f"user {user_id} not found")
        return pd.DataFrame()

    user_liked = df[(df['user_id'] == user_id) & (df['rating'] >= 4)]['parent_asin'].tolist()
    if not user_liked:
        user_liked = df[df['user_id'] == user_id]['parent_asin'].tolist()

    all_rated = set(df[df['user_id'] == user_id]['parent_asin'].tolist())

    score_map = {}
    for asin in user_liked[:5]:
        similars = get_similar_items(asin, n=20)
        for _, row in similars.iterrows():
            if row['asin'] not in all_rated:
                score_map[row['asin']] = score_map.get(row['asin'], 0) + row['similarity']

    if not score_map:
        return pd.DataFrame()

    reco_df = pd.DataFrame(list(score_map.items()), columns=['asin', 'score'])
    reco_df = reco_df.sort_values('score', ascending=False).head(n)
    return reco_df.reset_index(drop=True)


print("evaluating...")

train_df, test_df = train_test_split(df, test_size=0.2, random_state=42)


def predict_rating(user_id, asin, k=10):
    if asin not in item_enc or user_id not in user_enc:
        return None

    item_idx = item_enc[asin]
    item_vec = sparse_matrix[item_idx]

    distances, indices = model_knn.kneighbors(item_vec, n_neighbors=k + 1)

    weighted_sum = 0
    weight_total = 0

    for dist, neighbor_idx in zip(distances.flatten()[1:], indices.flatten()[1:]):
        similarity = 1 - dist
        neighbor_asin = item_dec[neighbor_idx]
        user_ratings = train_df[(train_df['user_id'] == user_id) &
                                (train_df['parent_asin'] == neighbor_asin)]['rating']
        if not user_ratings.empty:
            weighted_sum += similarity * user_ratings.values[0]
            weight_total += similarity

    if weight_total == 0:
        return None
    return weighted_sum / weight_total


test_sample = test_df.sample(min(500, len(test_df)), random_state=42)
y_true, y_pred = [], []

for _, row in test_sample.iterrows():
    pred = predict_rating(row['user_id'], row['parent_asin'])
    if pred is not None:
        y_true.append(row['rating'])
        y_pred.append(pred)

if y_true:
    mae = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    print(f"evaluated on {len(y_true)} predictions")
    print(f"MAE: {mae:.4f}")
    print(f"RMSE: {rmse:.4f}")

print("\n--- demo ---")

sample_asin = df['parent_asin'].value_counts().index[0]
print(f"similar items to {sample_asin}:")
similar = get_similar_items(sample_asin, n=5)
print(similar.to_string(index=False))

sample_user = df['user_id'].value_counts().index[0]
print(f"\nrecommendations for user {sample_user}:")
recos = recommend_for_user(sample_user, n=5)
print(recos.to_string(index=False))

print("\ndone")
