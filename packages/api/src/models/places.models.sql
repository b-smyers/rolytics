CREATE TABLE IF NOT EXISTS places (
    id TEXT UNIQUE, -- External ID
    experience_id INTEGER,
    name TEXT,
    
    PRIMARY KEY (id, experience_id),
    FOREIGN KEY (experience_id) REFERENCES experiences(id) ON DELETE CASCADE
);