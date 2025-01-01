CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- Internal ID
    username VARCHAR(30) UNIQUE, -- Arbitrary limit
    email VARCHAR(254) UNIQUE, -- Theoretical max email length (RFC 3696, erratum 1690 - https://www.rfc-editor.org/errata_search.php?rfc=3696)
    password VARCHAR(60), -- bcrypt hash length
    api_key TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME DEFAULT CURRENT_TIMESTAMP
);