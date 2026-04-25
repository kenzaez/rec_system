import pandas as pd
from sqlalchemy import create_engine
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import traceback

class ContentBasedRecommender:
    def __init__(self, db_url="postgresql://pfa_user:pfa_pass@localhost:5433/pfa_db"):
        self.db_url = db_url
        self.engine = create_engine(self.db_url)
        self.df = None
        self.cosine_sim = None
        self.indices = None

    def load_data(self):
        """Loads product data from the database."""
        print("Loading products from database")
        query = "SELECT parent_asin, title, cb_text, image_url FROM products"
        self.df = pd.read_sql(query, self.engine)
        
        # si les données sont nulles on les remplace par walou
        self.df['cb_text'] = self.df['cb_text'].fillna('')
        
        # creation d'un index inverse pour chaque produit       
        self.indices = pd.Series(self.df.index, index=self.df['parent_asin']).drop_duplicates()
        print(f"Loaded {len(self.df)} products.")

    def build_model(self):
        """Builds the TF-IDF matrix and computes cosine similarity."""
        if self.df is None or self.df.empty:
            raise ValueError("Data not loaded. Call load_data() first.")
            
        print("Building TF-IDF matrix")
        tfidf = TfidfVectorizer(stop_words='english')
        tfidf_matrix = tfidf.fit_transform(self.df['cb_text'])
        
        print("Computing cosine similarity")
        self.cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
        print("Model generated successfully.")

    def get_similar_products(self, asin, top_n=5):
        """Returns the top_n most similar products to the given ASIN."""
        if self.cosine_sim is None:
            raise ValueError("Model not built. Call build_model() first.")
            
        if asin not in self.indices:
            print(f"Warning: ASIN '{asin}' not found in database.")
            return pd.DataFrame()
            
        # kat recuperi les indices dyal les produits similaires
        idx = self.indices[asin]
        
        # si les indices sont dupliqués, on prend le premier
        if isinstance(idx, pd.Series):
            idx = idx.iloc[0]

        # similarity scores dyal les produits 
        sim_scores = list(enumerate(self.cosine_sim[idx]))

        # les produits li kaytchabhou
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

        # katakhoud score dyal top 5 dyal les produits et kanbdaw b 1 bach maytle3ch le produit lrassou
        top_indices = [i[0] for i in sim_scores[1:top_n+1]]
        top_scores = [i[1] for i in sim_scores[1:top_n+1]]

        # Retourne les produits les plus similaires
        results = self.df.iloc[top_indices][['parent_asin', 'title', 'image_url']].copy()
        results['similarity_score'] = top_scores
        return results

if __name__ == "__main__":
    try:
        recommender = ContentBasedRecommender()
        recommender.load_data()
        recommender.build_model()
        
        # test sur des produits aléatoires
        sample_asin = recommender.df['parent_asin'].iloc[0]
        sample_title = recommender.df['title'].iloc[0]
        
        print("\n" + "="*50)
        print(f"RECOMMENDATIONS FOR: {sample_title} (ASIN: {sample_asin})")
        print("="*50)
        
        recs = recommender.get_similar_products(sample_asin, top_n=5)
        
        if not recs.empty:
            for i, row in recs.iterrows():
                print(f"-> ASIN: {row['parent_asin']} | Sim: {row['similarity_score']:.2f} | Title: {row['title']}")
        else:
            print("No recommendations found.")
            
    except Exception as e:
        print("An error occurred:")
        traceback.print_exc()