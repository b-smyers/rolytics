import db from '@services/sqlite.services';
import schema from '@schemas/settings.schemas.json';
import logger from '@services/logger.services';

interface Settings {
    theme?: string;
    currency?: string;
    abbreviateUserCounts?: boolean;
    lastModified?: number;
    [key: string]: any;
}

function createSettings(userId: number, settings: Settings = {}): void {
    const query = `INSERT INTO user_settings (user_id, setting_key, setting_value) VALUES (?, ?, ?)`;

    const timestamp = Date.now();

    settings = {
        theme: schema.theme.default,
        currency: schema.currency.default,
        abbreviateUserCounts: schema.abbreviateUserCounts.default,
        ...settings,
        lastModified: timestamp
    };

    const transaction = db.transaction((settings: Settings) => {
        Object.entries(settings).forEach(([key, value]) => {
            db.prepare(query).run(userId, key, JSON.stringify(value));
        });
    });

    transaction(settings);
    logger.info(`Default settings initialized for user ${userId}`);
}

function getSettings(userId: number): Settings {
    const query = `SELECT setting_key, setting_value FROM user_settings WHERE user_id = ?`;
    const result = db.prepare(query).all(userId);

    const settings: Settings = {};

    (result as { setting_key: string; setting_value: string }[]).forEach(({ setting_key, setting_value }) => {
        try {
            settings[setting_key] = JSON.parse(setting_value);
        } catch {
            settings[setting_key] = setting_value;
            logger.warn(`Failed to parse setting value for key '${setting_key}' for user ${userId}`);
        }
    });

    logger.info(`Fetched settings for user ${userId}`);
    return settings;
}

function updateSettings(userId: number, settings: Settings): number {
    const query = `UPDATE user_settings SET setting_value = ? WHERE user_id = ? AND setting_key = ?`;

    const lastModified = Date.now();

    settings = { ...settings, lastModified };

    const transaction = db.transaction((settings: Settings) => {
        Object.entries(settings).forEach(([key, value]) => {
            const result = db.prepare(query).run(JSON.stringify(value), userId, key);
            if (result.changes === 0) {
                logger.warn(`Setting update skipped because setting '${key}' does not exist for user ${userId}`);
            }
        });
    });

    transaction(settings);
    logger.info(`Completed settings update for user ${userId}`);
    return lastModified;
}

const settingsService = {
    createSettings,
    getSettings,
    updateSettings
};

export default settingsService;