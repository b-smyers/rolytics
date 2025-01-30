CREATE TABLE IF NOT EXISTS analytics (
    timestamp DATETIME NOT NULL,
    server_id INTEGER,
    purchases TEXT NOT NULL,
    performance TEXT NOT NULL,
    social TEXT NOT NULL,
    players TEXT NOT NULL,
    metadata TEXT NOT NULL,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (timestamp, server_id),
    FOREIGN KEY (server_id) REFERENCES servers(server_id) ON DELETE CASCADE
);