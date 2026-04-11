-- TABLE 1 : users
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(50) PRIMARY KEY
);

-- TABLE 2 : products
CREATE TABLE IF NOT EXISTS products (
    parent_asin     VARCHAR(20) PRIMARY KEY,
    title           TEXT,
    main_category   VARCHAR(100),
    price           FLOAT,
    store           VARCHAR(100),
    categories      TEXT,
    average_rating  FLOAT,
    rating_number   INTEGER,
    features        TEXT,
    description     TEXT,
    cb_text         TEXT,
    image_url       TEXT
);

-- TABLE 3 : ratings
CREATE TABLE IF NOT EXISTS ratings (
    id                  SERIAL PRIMARY KEY,
    user_id             VARCHAR(50) REFERENCES users(user_id),
    parent_asin         VARCHAR(20) REFERENCES products(parent_asin),
    rating              FLOAT,
    timestamp           BIGINT,
    review_date         TIMESTAMP,
    helpful_vote        INTEGER,
    verified_purchase   BOOLEAN
);

-- TABLE 4 : reviews_text
CREATE TABLE IF NOT EXISTS reviews_text (
    id                SERIAL PRIMARY KEY,
    user_id           VARCHAR(50) REFERENCES users(user_id),
    parent_asin       VARCHAR(20) REFERENCES products(parent_asin),
    text              TEXT,
    word_count        INTEGER,
    sentiment_score   FLOAT
);