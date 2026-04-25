from sqlalchemy import create_engine, text

engine = create_engine('postgresql://pfa_user:pfa_pass@localhost:5432/pfa_db')
tables_to_drop = [
    'django_session',
    'django_admin_log',
    'auth_user',
    'auth_user_groups',
    'auth_user_user_permissions',
    'auth_group_permissions',
    'auth_group',
    'auth_permission',
    'django_content_type',
    'django_migrations'
]

with engine.connect() as conn:
    for table in tables_to_drop:
        try:
            conn.execute(text(f"DROP TABLE {table} CASCADE;"))
            print(f"Dropped {table}")
        except Exception as e:
            print(f"Failed to drop {table}: {e}")
    conn.commit()
    print("Done dropping tables.")
