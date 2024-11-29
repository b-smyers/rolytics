const getDatabase = require('@services/sqlite.services');
let db;
(async function() { db = await getDatabase() })()

async function getSettings(userId) {
    const query = `SELECT * FROM user_settings WHERE user_id = ?`;
    try {
        return await db.all(query, [userId]);
    } catch (error) {
        throw new Error(`Unable to get user's settings: ${error.message}`);
    }
}

async function setSettings(userId, settings) {
    // Adds settings for user, if a setting already exists then it is overwritten
    const query = `INSERT INTO user_settings (user_id, setting_key, setting_value)
                   VALUES (?, ?, ?)
                   ON CONFLICT(user_id, setting_key) DO UPDATE SET setting_value = excluded.setting_value`;

    try {
        await db.run('BEGIN TRANSACTION');

        for (const [key, value] of Object.entries(settings)) {
            await db.run(query, [userId, key, value]);
        }

        await db.run('COMMIT');
    } catch (error) {
        await db.run('ROLLBACK');
        throw new Error(`Unable to set user's settings: ${error.message}`);
    }
}

module.exports = {
    getSettings,
    setSettings
}