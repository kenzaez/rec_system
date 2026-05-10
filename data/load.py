"""
load_to_db.py
─────────────
Charge les 4 CSV préparés par prepare_data.py dans PostgreSQL.

Usage :
    python load_to_db.py
    python load_to_db.py --base "D:/mon/autre/chemin/pfa"
    python load_to_db.py --db-url "postgresql://user:pass@localhost:5432/pfa_db"
"""

import argparse
import os
import sys
import time
from pathlib import Path

import pandas as pd
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError


# ─────────────────────────────────────────────────────────────
# CONFIGURATION  ← seul endroit à modifier si besoin
# ─────────────────────────────────────────────────────────────
DEFAULT_BASE    = Path(r"C:\Users\pc\Desktop\pfa")
DEFAULT_DB_URL  = "postgresql://pfa_user:pfa_pass@localhost:5432/pfa_db"

# Taille des chunks pour les grandes tables (évite les timeouts)
CHUNK_SIZE = 5_000


# ─────────────────────────────────────────────────────────────
# UTILITAIRES
# ─────────────────────────────────────────────────────────────
def section(title: str) -> None:
    print(f"\n{'─' * 55}")
    print(f"  {title}")
    print(f"{'─' * 55}")


def check_csv_files(final: Path) -> None:
    """Vérifie que tous les CSV existent avant de démarrer."""
    missing = []
    for f in ["users.csv", "products.csv", "ratings.csv", "reviews_text.csv"]:
        if not (final / f).exists():
            missing.append(str(final / f))
    if missing:
        print("\n❌ Fichiers CSV introuvables :")
        for m in missing:
            print(f"   {m}")
        print("\nLance d'abord prepare_data.py pour générer les CSV.")
        sys.exit(1)


def test_connection(engine) -> None:
    """Teste la connexion avant d'insérer quoi que ce soit."""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("  ✔  Connexion PostgreSQL OK")
    except OperationalError as e:
        print(f"\n❌ Impossible de se connecter à PostgreSQL :\n   {e}")
        print("\nVérifie que :")
        print("  - PostgreSQL est bien démarré")
        print("  - Les identifiants dans --db-url sont corrects")
        print("  - La base 'pfa_db' existe (sinon : CREATE DATABASE pfa_db;)")
        sys.exit(1)


def insert_table(
    df: pd.DataFrame,
    table_name: str,
    engine,
    chunk_size: int,
    if_exists: str = "append",
) -> None:
    """
    Insère un DataFrame dans PostgreSQL par chunks.
    Affiche une barre de progression simple.
    """
    total   = len(df)
    chunks  = range(0, total, chunk_size)
    n_chunks = len(list(chunks))
    inserted = 0
    t0 = time.time()

    for i, start in enumerate(range(0, total, chunk_size), 1):
        chunk = df.iloc[start : start + chunk_size]
        chunk.to_sql(table_name, engine, if_exists=if_exists, index=False)
        inserted += len(chunk)
        pct = inserted / total * 100
        elapsed = time.time() - t0
        print(
            f"  [{i:>3}/{n_chunks}]  {inserted:>10,} / {total:,} lignes  "
            f"({pct:5.1f}%)  {elapsed:5.1f}s",
            end="\r",
        )

    elapsed = time.time() - t0
    size_mb = df.memory_usage(deep=True).sum() / 1_048_576
    print(
        f"  ✔  {table_name:<20} {total:>10,} lignes  "
        f"({size_mb:.1f} MB en mémoire)  {elapsed:.1f}s"
        + " " * 20  # efface le \r précédent
    )


# ─────────────────────────────────────────────────────────────
# CHARGEMENT DES CSV
# ─────────────────────────────────────────────────────────────
def load_csvs(final: Path) -> dict[str, pd.DataFrame]:
    section("CHARGEMENT DES CSV")
    tables = {}
    for name in ["users", "products", "ratings", "reviews_text"]:
        path = final / f"{name}.csv"
        t0 = time.time()
        df  = pd.read_csv(path, encoding="utf-8-sig", low_memory=False)
        tables[name] = df
        size_mb = path.stat().st_size / 1_048_576
        print(f"  {name:<20} {len(df):>10,} lignes  ({size_mb:.1f} MB)  {time.time()-t0:.1f}s")
    return tables


# ─────────────────────────────────────────────────────────────
# INSERTION
# ─────────────────────────────────────────────────────────────
def insert_all(tables: dict[str, pd.DataFrame], engine, chunk_size: int) -> None:
    section("INSERTION DANS POSTGRESQL")

    # Ordre d'insertion respectant les clés étrangères :
    # users et products d'abord, puis ratings et reviews_text
    order = ["users", "products", "ratings", "reviews_text"]

    for name in order:
        df = tables[name]
        print(f"\n  → {name}")
        insert_table(df, name, engine, chunk_size=chunk_size, if_exists="append")


# ─────────────────────────────────────────────────────────────
# VÉRIFICATION POST-INSERTION
# ─────────────────────────────────────────────────────────────
def verify(tables: dict[str, pd.DataFrame], engine) -> None:
    section("VÉRIFICATION")
    all_ok = True
    with engine.connect() as conn:
        for name, df in tables.items():
            result = conn.execute(text(f"SELECT COUNT(*) FROM {name}")).scalar()
            expected = len(df)
            status   = "✔" if result == expected else "❌"
            if result != expected:
                all_ok = False
            print(f"  {status}  {name:<20} attendu={expected:>10,}  en base={result:>10,}")

    if not all_ok:
        print("\n⚠  Certaines tables ont un nombre de lignes inattendu.")
        print("   Vérifie les contraintes d'unicité ou les doublons dans les CSV.")
    else:
        print("\n  ✅ Toutes les tables sont correctement chargées.")


# ─────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────
def main() -> None:
    parser = argparse.ArgumentParser(description="Charge les CSV du PFA dans PostgreSQL.")
    parser.add_argument(
        "--base",
        type=Path,
        default=DEFAULT_BASE,
        help=f"Chemin racine du projet (défaut : {DEFAULT_BASE})",
    )
    parser.add_argument(
        "--db-url",
        default=os.environ.get("PFA_DB_URL", DEFAULT_DB_URL),
        help="URL de connexion PostgreSQL (défaut : variable d'env PFA_DB_URL ou DEFAULT_DB_URL)",
    )
    parser.add_argument(
        "--chunk-size",
        type=int,
        default=CHUNK_SIZE,
        help=f"Taille des chunks d'insertion (défaut : {CHUNK_SIZE})",
    )
    args = parser.parse_args()

    final = args.base / "final"

    print(f"\n{'═' * 55}")
    print(f"  PFA — Chargement PostgreSQL")
    print(f"{'═' * 55}")
    print(f"  CSV source : {final}")
    print(f"  Base cible : {args.db_url.split('@')[-1]}")   # cache user:pass dans les logs

    check_csv_files(final)

    engine = create_engine(
        args.db_url,
        pool_pre_ping=True,         # détecte les connexions mortes
        pool_size=5,
        max_overflow=10,
        connect_args={"connect_timeout": 30},
    )

    test_connection(engine)

    t_start = time.time()

    tables = load_csvs(final)
    insert_all(tables, engine, chunk_size=args.chunk_size)
    verify(tables, engine)

    print(f"\n{'═' * 55}")
    print(f"  ✅ Terminé en {time.time() - t_start:.1f}s")
    print(f"{'═' * 55}\n")


if __name__ == "__main__":
    main()