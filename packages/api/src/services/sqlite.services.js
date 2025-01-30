const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbFile = 'database.db';

// SQL schema files
const modelFiles = [
    path.join(__dirname, '../models', 'users.models.sql'),
    path.join(__dirname, '../models', 'experiences.models.sql'),
    path.join(__dirname, '../models', 'places.models.sql'),
    path.join(__dirname, '../models', 'servers.models.sql'),
    path.join(__dirname, '../models', 'metrics.models.sql'),
    path.join(__dirname, '../models', 'user_settings.models.sql'),
];

let db;
let initPromise;

async function initializeDatabase() {
    if (initPromise) {
        return initPromise;
    }

    initPromise = new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbFile, (err) => {
            if (err) {
                console.error(`Error connecting to database: ${err.message}`);
                reject(err);
            } else {
                console.log('Database connected');
                resolve(db);
            }
        });
    });

    db = await initPromise;

    try {
        for (const filePath of modelFiles) {
            const schema = fs.readFileSync(filePath, 'utf-8');
            await new Promise((resolve, reject) => {
                db.exec(schema, (err) => {
                    if (err) {
                        console.error(`Error executing schema from ${filePath}: ${err.message}`);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }
        console.log('All schemas executed successfully');
    } catch (err) {
        console.error(`Error during schema execution: ${err.message}`);
        throw err;
    }

    return db;
}

async function getDatabase() {
    if (db) {
        return db; // Return if already initialized
    }

    // Initialize the database if not already done
    return await initializeDatabase();
}

module.exports = getDatabase;