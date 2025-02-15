const settingsService = require('@services/settings.services');
const usersService = require('@services/users.services');

const schema = require('@schemas/settings.schemas.json');

function validateSetting(key, value) {
    const setting = schema[key];
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

function getSettings(req, res) {
    try {
        const settings = settingsService.getSettings(req.user.id);
        res.status(200).json({
            code: 200,
            status: 'success',
            data: {
                message: 'Settings successfully retrieved',
                settings: settings
            }
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            status: 'error',
            data: {
                message: 'Failed to retrieve settings'
            }
        });
    }
}

function updateSettings(req, res) {
    const { settings } = req.body;

    try {
        // Validate new setting changes
        for (const [key, value] of Object.entries(settings)) {
            const result = validateSetting(key, value);
            if (!result.valid) {
                return res.status(400).json({
                    code: 400,
                    status: 'error',
                    data: {
                        message: result.message
                    }
                });
            }
        }

        settingsService.updateSettings(req.user.id, settings);
        res.status(200).json({
            code: 200,
            status: 'success',
            data: {
                message: 'Settings updated successfully'
            }
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            status: 'error',
            data: {
                message: 'Failed to update settings'
            }
        });
    }
}

function getProfile(req, res) {
    try {
        const user = usersService.getUserById(req.user.id);
        res.status(200).json({
            code: 200,
            status: 'success',
            data: {
                message: 'Profile retrieved successfully',
                profile: user
            }
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            status: 'error',
            data: {
                message: 'Failed to retrieve profile'
            }
        });
    }
}

module.exports = {
    getSettings,
    updateSettings,
    getProfile
}