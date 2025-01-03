CREATE TABLE IF NOT EXISTS servers (
    server_id INTEGER PRIMARY KEY AUTOINCREMENT, -- Internal ID
    roblox_server_id TEXT UNIQUE, -- External ID
    place_id INTEGER,
    name TEXT,
    active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (place_id) REFERENCES places(place_id) ON DELETE CASCADE
);