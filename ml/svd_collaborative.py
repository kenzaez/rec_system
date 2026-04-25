import pandas as pd
import numpy as np
from sqlalchemy import create_engine
from scipy.sparse import csr_matrix
from scipy.sparse.linalg import svds
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error
import pickle
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
 
print("loading data")
 
query = """
    SELECT user_id, parent_asin, rating
    FROM ratings
    WHERE rating IS NOT NULL
"""
df = pd.read_sql(query, engine)
print(f"got {len(df)} rows, {df['user_id'].nunique()} users, {df['parent_asin'].nunique()} items")
 
print("filtering")
 
user_counts = df['user_id'].value_counts()
item_counts = df['parent_asin'].value_counts()
 
df = df[
    df['user_id'].isin(user_counts[user_counts >= 3].index) &
    df['parent_asin'].isin(item_counts[item_counts >= 5].index)
]
print(f"after filter: {len(df)} rows, {df['user_id'].nunique()} users, {df['parent_asin'].nunique()} items")
 
print("encoding")
 
user_enc = {u: i for i, u in enumerate(df['user_id'].unique())}
item_enc = {p: i for i, p in enumerate(df['parent_asin'].unique())}
item_dec = {i: p for p, i in item_enc.items()}
user_dec = {i: u for u, i in user_enc.items()}
 
df['user_idx'] = df['user_id'].map(user_enc)
df['item_idx'] = df['parent_asin'].map(item_enc)
 
n_users = len(user_enc)
n_items = len(item_enc)
 
print("building matrix")
 
sparse_matrix = csr_matrix(
    (df['rating'].values, (df['user_idx'].values, df['item_idx'].values)),
    shape=(n_users, n_items)
)
 
print("running SVD")
 
matrix = sparse_matrix.toarray().astype(float)
 
user_mean = np.true_divide(matrix.sum(1), (matrix != 0).sum(1))
matrix_normalized = matrix.copy()
for i in range(n_users):
    mask = matrix_normalized[i] != 0
    matrix_normalized[i][mask] -= user_mean[i]
 
K = 50
U, sigma, Vt = svds(csr_matrix(matrix_normalized), k=K)
sigma = np.diag(sigma)
 
predicted_ratings = np.dot(np.dot(U, sigma), Vt) + user_mean.reshape(-1, 1)
predicted_ratings = np.clip(predicted_ratings, 1, 5)
print(f"predicted matrix shape: {predicted_ratings.shape}")
 
print("evaluating...")
 
train_df, test_df = train_test_split(df, test_size=0.2, random_state=42)
 
y_true, y_pred = [], []
 
test_sample = test_df.sample(min(500, len(test_df)), random_state=42)
 
for _, row in test_sample.iterrows():
    u_idx = user_enc.get(row['user_id'])
    i_idx = item_enc.get(row['parent_asin'])
    if u_idx is not None and i_idx is not None:
        pred = predicted_ratings[u_idx][i_idx]
        pred = float(np.clip(pred, 1, 5))
        y_true.append(row['rating'])
        y_pred.append(pred)
 
mae  = mean_absolute_error(y_true, y_pred)
rmse = np.sqrt(mean_squared_error(y_true, y_pred))
print(f"evaluated on {len(y_true)} predictions")
print(f"MAE: {mae:.4f}")
print(f"RMSE: {rmse:.4f}")
 
 
def recommend_for_user(user_id, n=10):
    if user_id not in user_enc:
        print(f"user {user_id} not found")
        return pd.DataFrame()
 
    u_idx = user_enc[user_id]
    user_ratings = predicted_ratings[u_idx]
 
    rated = set(df[df['user_id'] == user_id]['item_idx'].tolist())
    scores = [
        (item_dec[i], round(float(user_ratings[i]), 4))
        for i in range(n_items)
        if i not in rated
    ]
    scores.sort(key=lambda x: x[1], reverse=True)
    return pd.DataFrame(scores[:n], columns=['asin', 'predicted_rating'])
 
 
print("\n--- demo ---")
 
sample_user = df['user_id'].value_counts().index[0]
print(f"recommendations for user {sample_user}:")
recos = recommend_for_user(sample_user, n=5)
print(recos.to_string(index=False))
 
print("\nsaving model...")
with open('svd_model.pkl', 'wb') as f:
    pickle.dump({
        'U': U,
        'sigma': sigma,
        'Vt': Vt,
        'predicted_ratings': predicted_ratings,
        'user_enc': user_enc,
        'item_enc': item_enc,
        'item_dec': item_dec,
        'user_dec': user_dec,
    }, f)
print("model saved to svd_model.pkl")
 
print("\ndone")