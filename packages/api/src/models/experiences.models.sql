CREATE TABLE IF NOT EXISTS experiences (
    experience_id INTEGER PRIMARY KEY AUTOINCREMENT, -- Internal ID
    roblox_experience_id INTEGER, -- External ID
    user_id INTEGER,
    name VARCHAR(50), -- Roblox enforced limit
    description VARCHAR(1000), -- Roblox enforced limit
    page_link TEXT,
    thumbnail_link TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    -- Aggregated Data
    purchases TEXT,
    performance TEXT,
    social TEXT,
    players TEXT,
    metadata TEXT,
    last_computed_at DATETIME DEFAULT '1900-01-01 00:00:00',

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);