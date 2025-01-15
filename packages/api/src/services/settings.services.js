const getDatabase = require('@services/sqlite.services');
let db;
(async function() { db = await getDatabase() })()

async function getSettings(userId) {
    const query = `SELECT setting_key, setting_value FROM user_settings WHERE user_id = ?`;

    return new Promise((resolve, reject) => {
        db.all(query, [userId], function (error, rows) {
            if (error) {
                console.error(`An error occured getting user's settings: ${error.message}`);
                reject(error);
            }
            resolve(rows);
        });
    });
}

async function setSettings(userId, settings) {
    // Adds settings for user, if a setting already exists then it is overwritten
    const query = `INSERT INTO user_settings (user_id, setting_key, setting_value)
                   VALUES (?, ?, ?)
                   ON CONFLICT(user_id, setting_key) DO UPDATE SET setting_value = excluded.setting_value`;

    try {
        await new Promise((resolve, reject) => {
            db.run('BEGIN TRANSACTION', function (error) {
                if (error) {
                    console.error(`An error occured starting transaction: ${error.message}`);
                    reject(error);
                }
                resolve();
            });
        });

        const queries = Object.entries(settings).map(([key, value]) => {
            return new Promise((resolve, reject) => {
                db.run(query, [userId, key, value], function (error) {
                    if (error) {
                        console.error(`An error occured setting user's settings: ${error.message}`);
                        reject(error);
                    }
                    resolve();
                });
            });
        });

        await Promise.all(queries);

        await new Promise((resolve, reject) => {
            db.run('COMMIT', function (error) {
                if (error) return reject(error);
                resolve();
            });
        });
    } catch (error) {
        await new Promise((resolve, reject) => {
            db.run('ROLLBACK', function (error) {
                if (error) {
                    console.error(`An error occurred during rollback: ${error.message}`);
                    reject(error);
                }
                resolve(); // Resolve rollback even if it fails
            });
        });
        throw new Error(`Unable to set user's settings: ${error.message}`);
    }
}

module.exports = {
    getSettings,
    setSettings
}