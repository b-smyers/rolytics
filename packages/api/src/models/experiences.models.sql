CREATE TABLE IF NOT EXISTS experiences (
    user_id INTEGER,
    place_id INTEGER,
    universe_id INTEGER,
    thumbnail_link TEXT,
    page_link TEXT,
    title TEXT,
    description CHAR(1024),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, universe_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);