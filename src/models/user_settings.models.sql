CREATE TABLE IF NOT EXISTS user_settings (
    user_id INTEGER NOT NULL,
    setting_key TEXT NOT NULL,
    setting_value TEXT,
    PRIMARY KEY (user_id, setting_key),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE (user_id, setting_key)
);