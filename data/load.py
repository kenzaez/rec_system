import pandas as pd
import psycopg2
from sqlalchemy import create_engine


engine = create_engine("postgresql://pfa_user:pfa_pass@localhost:5432/pfa_db")

output = r"C:\Users\kenza\Desktop\pfa\final"


print("csv")
users        = pd.read_csv(f"{output}\\users.csv")
products     = pd.read_csv(f"{output}\\products.csv")
ratings      = pd.read_csv(f"{output}\\ratings.csv")
reviews_text = pd.read_csv(f"{output}\\reviews_text.csv")


print("Inserting users...")
users.to_sql("users", engine, if_exists="append", index=False)
print(f"  {len(users)} rows")

print("Inserting products...")
products.to_sql("products", engine, if_exists="append", index=False)
print(f"  {len(products)} rows")

print("Inserting ratings...")
ratings.to_sql("ratings", engine, if_exists="append", index=False)
print(f" {len(ratings)} rows")

print("Inserting reviews_text...")
reviews_text.to_sql("reviews_text", engine, if_exists="append", index=False)
print(f"  {len(reviews_text)} rows")

print("\nDone")