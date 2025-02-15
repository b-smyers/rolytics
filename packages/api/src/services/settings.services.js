const db = require('@services/sqlite.services');
const schema = require('@schemas/settings.schemas.json');

function createSettings(userId, settings) {
    const query = `INSERT INTO user_settings (user_id, setting_key, setting_value) VALUES (?, ?, ?)`;

    settings = {
        theme: schema.theme.default,
        currency: schema.currency.default,
        abbreviateUserCounts: schema.abbreviateUserCounts.default,
        ...settings
    };    

    const transaction = db.transaction(settings => {
        Object.entries(settings).forEach(([key, value]) => {
            db.prepare(query).run(userId, key, JSON.stringify(value));
        });
    });

    transaction(settings);
}

function getSettings(userId) {
    const query = `SELECT setting_key, setting_value FROM user_settings WHERE user_id = ?`;
    const result = db.prepare(query).all(userId);

    const settings = {};

    result.forEach(({ setting_key, setting_value }) => {
        try {
            settings[setting_key] = JSON.parse(setting_value);
        } catch {
            settings[setting_key] = setting_value;
        }
    });

    return settings;
}

function updateSettings(userId, settings) {
    const query = `UPDATE user_settings SET setting_value = ? WHERE user_id = ? AND setting_key = ?`;

    const transaction = db.transaction(settings => {
        Object.entries(settings).forEach(([key, value]) => {
            const result = db.prepare(query).run(JSON.stringify(value), userId, key);
            if (result.changes === 0) {
                console.warn(`Skipping update: Setting '${key}' does not exist for user ${userId}`);
            }
        });
    });

    transaction(settings);
}

module.exports = {
    createSettings,
    getSettings,
    updateSettings
};