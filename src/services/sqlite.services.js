const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const fs = require('fs').promises;
const path = require('path');

const dbFile = 'database.db';

// sql schemas
const modelFiles = [
    path.join(__dirname, '../models', 'users.models.sql'),
    path.join(__dirname, '../models', 'experiences.models.sql'),
    path.join(__dirname, '../models', 'servers.models.sql'),
    path.join(__dirname, '../models', 'analytics.models.sql'),
    path.join(__dirname, '../models', 'user_settings.models.sql')
];

async function executeSchemaFile(db, filePath) {
    try {
        const schema = await fs.readFile(filePath, 'utf-8');
        await db.exec(schema);
    } catch (err) {
        console.error(`Error executing schema file ${filePath}:`, err);
    }
}

async function database() {
    try {
        const db = await open({
            filename: dbFile,
            driver: sqlite3.Database
        });

        console.log('Database connected');

        for (const filePath of modelFiles) {
            await executeSchemaFile(db, filePath);
        }

        return db;
    } catch (err) {
        console.error('Error setting up database:', err);
        throw err;
    }
}

module.exports = database();