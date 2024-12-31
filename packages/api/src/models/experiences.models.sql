CREATE TABLE IF NOT EXISTS experiences (
    id INTEGER, -- External ID
    user_id INTEGER,
    name VARCHAR(50), -- Roblox enforced limit
    description VARCHAR(1000), -- Roblox enforced limit
    page_link TEXT,
    thumbnail_link TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id, user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);