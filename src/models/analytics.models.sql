CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id TEXT,
    timestamp DATETIME,
    metric_name TEXT,
    metric_value REAL,
    FOREIGN KEY (server_id) REFERENCES servers(server_id)
);