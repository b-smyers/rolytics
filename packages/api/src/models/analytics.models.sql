CREATE TABLE IF NOT EXISTS analytics (
    server_id TEXT NOT NULL,
    timestamp DATETIME NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value REAL NOT NULL,
    PRIMARY KEY (server_id, timestamp, metric_name),
    FOREIGN KEY (server_id) REFERENCES servers(server_id) ON DELETE CASCADE
);