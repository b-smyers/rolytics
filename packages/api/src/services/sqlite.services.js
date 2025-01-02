const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const fs = require('fs');
const path = require('path');

const dbFile = 'database.db';

// sql schemas
const modelFiles = [
    path.join(__dirname, '../models', 'users.models.sql'),
    path.join(__dirname, '../models', 'experiences.models.sql'),
    path.join(__dirname, '../models', 'places.models.sql'),
    path.join(__dirname, '../models', 'servers.models.sql'),
    path.join(__dirname, '../models', 'analytics.models.sql'),
    path.join(__dirname, '../models', 'user_settings.models.sql')
];

let db;

async function getDatabase() {
    if (!db) {
        db = await open({
            filename: dbFile,
            driver: sqlite3.Database
        });

        console.log('Database connected');

        try {
            for (const filePath of modelFiles) {
                const schema = fs.readFileSync(filePath, 'utf-8');
                await db.exec(schema);
            }
            console.log('All schemas executed successfully');
        } catch (error) {
            console.error(`Error executing schemas: ${error}`);
        }
    }
    return db;
}

module.exports = getDatabase;