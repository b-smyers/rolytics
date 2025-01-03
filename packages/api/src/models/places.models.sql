CREATE TABLE IF NOT EXISTS places (
    place_id INTEGER PRIMARY KEY AUTOINCREMENT, -- Internal ID
    roblox_place_id TEXT UNIQUE, -- External ID
    experience_id INTEGER,
    name TEXT,
    -- Aggregated Data
    purchases TEXT,
    performance TEXT,
    social TEXT,
    players TEXT,
    metadata TEXT,
    last_computed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (experience_id) REFERENCES experiences(experience_id) ON DELETE CASCADE
);