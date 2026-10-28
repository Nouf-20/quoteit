-- QuoteIt — Cloudflare D1 schema (mirrors the Laravel SQLite schema)
PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS quote_likes;
DROP TABLE IF EXISTS quotes;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quote_likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quote_id INTEGER NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (quote_id, user_id)
);

CREATE INDEX idx_quotes_created_at ON quotes (created_at DESC);
CREATE INDEX idx_quotes_user_id ON quotes (user_id);
CREATE INDEX idx_likes_quote_id ON quote_likes (quote_id);
CREATE INDEX idx_likes_user_id ON quote_likes (user_id);
