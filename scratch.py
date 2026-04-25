from sqlalchemy import create_engine, text
engine = create_engine('postgresql://pfa_user:pfa_pass@localhost:5432/pfa_db')
with engine.connect() as conn:
    tables = conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema='public';")).fetchall()
    print([t[0] for t in tables])
    migrations = conn.execute(text("SELECT app, name FROM django_migrations;")).fetchall()
    print(migrations)
