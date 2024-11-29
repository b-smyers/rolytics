CREATE TABLE IF NOT EXISTS analytics (
    experience_id TEXT NOT NULL,
    server_id TEXT NOT NULL,
    timestamp DATETIME NOT NULL,
    purchases TEXT NOT NULL,
    performance TEXT NOT NULL,
    social TEXT NOT NULL,
    players TEXT NOT NULL,
    metadata TEXT NOT NULL,
    PRIMARY KEY (experience_id, server_id, timestamp),
    FOREIGN KEY (experience_id) REFERENCES experiences(experience_id) ON DELETE CASCADE
    FOREIGN KEY (server_id) REFERENCES servers(server_id) ON DELETE CASCADE
);