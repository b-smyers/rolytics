CREATE TABLE IF NOT EXISTS servers (
    id TEXT UNIQUE, -- External ID
    place_id INTEGER,
    name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id, place_id),
    FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE
);