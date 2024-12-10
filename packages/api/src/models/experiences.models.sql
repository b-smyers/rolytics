CREATE TABLE IF NOT EXISTS experiences (
    user_id INTEGER,
    experience_id TEXT,
    title TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    api_key TEXT UNIQUE,
    PRIMARY KEY (user_id, experience_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);