const settingsdb = require('@services/settings.services');
const usersdb = require('@services/users.services');

const settingsSchema = {
    theme: {
        type: 'string',
        allowedValues: ['light', 'dark'],
        default: 'light'
    },
    currency: {
        type: 'string',
        allowedValues: ['R$', 'USD', 'EUR'],
        default: 'R$'
    },
    abbreviateUserCounts: {
        type: 'boolean',
        default: true
    }
}

function validateSetting(key, value) {
    const setting = settingsSchema[key];
    if (!setting) {
        return { valid: false, message: `Unknown setting: ${key}` };
    }

    // Check type
    if (typeof value !== setting.type) {
        return { valid: false, message: `Invalid type for ${key}: expected ${setting.type}` };
    }

    // Check allowed values if applicable
    if (setting.allowedValues && !setting.allowedValues.includes(value)) {
        return { valid: false, message: `Invalid value for ${key}: allowed values are ${setting.allowedValues.join(', ')}` };
    }

    return { valid: true };
}

async function getSettings(req, res) {
    try {
        const settings = await settingsdb.getSettings(req.user?.id);
        res.status(200).json({ settings });
    } catch (error) {
        console.error('Error retrieving settings:', error);
        res.status(500).json({ message: 'Failed to retrieve settings' });
    }
}

async function updateSettings(req, res) {
    const { theme, currency, abbreviateUserCounts } = req.body;

    // Validate new setting changes
    const settings = { theme, currency, abbreviateUserCounts }
    for (const [key, value] of Object.entries(settings)) {
        const result = validateSetting(key, value);
        if (!result.valid) {
            return res.status(400).json({ error: result.message });
        }
    }

    // Use defaults for missing settings
    const updatedSettings = {
        theme: theme ?? settingsSchema.theme.default,
        currency: currency ?? settingsSchema.currency.default,
        abbreviateUserCounts: abbreviateUserCounts ?? settingsSchema.abbreviateUserCounts.default
    };

    // Update settingsdb
    try {
        await settingsdb.setSettings(req.user?.id, updatedSettings);
        res.status(200).json({ message: 'Settings updated successfully' });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ message: 'Failed to update settings' });
    }
}

async function getProfile(req, res) {
    try {
        const profile = await usersdb.getUser(req.user?.id);
        res.status(200).json({ profile });
    } catch (error) {
        console.error('Error retrieving profile:', error);
        res.status(500).json({ message: 'Failed to retrieve profile' });
    }
}

module.exports = {
    getSettings,
    updateSettings,
    getProfile
}