const sqlite3 = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbFile = process.env.NODE_ENV !== 'test' ? 'database.db' : ':memory:';

// SQL schema files
const modelFiles = [
    path.join(__dirname, '../models', 'users.models.sql'),
    path.join(__dirname, '../models', 'experiences.models.sql'),
    path.join(__dirname, '../models', 'places.models.sql'),
    path.join(__dirname, '../models', 'servers.models.sql'),
    path.join(__dirname, '../models', 'metrics.models.sql'),
    path.join(__dirname, '../models', 'user_settings.models.sql'),
];

const db = sqlite3(dbFile);
db.pragma('journal_mode = WAL');
console.log('Database connected');

// Execute schemas
for (const filePath of modelFiles) {
    const schema = fs.readFileSync(filePath, 'utf-8');

    try {
        db.exec(schema);
    } catch (error) {
        console.error(`Model error: ${filePath}\nSQLite3 error:${error.message}`);
        process.exit(1);
    }
}
console.log('All schemas executed successfully');

// Export the database instance
module.exports = db;