const db = require('@services/sqlite.services');

function getSettings(userId) {
    const query = `SELECT setting_key, setting_value FROM user_settings WHERE user_id = ?`;
    return db.prepare(query).all(userId);
}

function setSettings(userId, settings) {
    const query = `INSERT INTO user_settings (user_id, setting_key, setting_value)
                   VALUES (?, ?, ?)
                   ON CONFLICT(user_id, setting_key) DO UPDATE SET setting_value = excluded.setting_value`;
    
    const transaction = db.transaction(settings => {
        Object.entries(settings).forEach(([key, value]) => {
            db.prepare(query).run(userId, key, JSON.stringify(value));
        });
    });

    transaction(settings);
}

module.exports = {
    getSettings,
    setSettings
};