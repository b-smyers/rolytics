import { BadRequest, InternalServerError, OK, Unauthorized } from '@lib/api-response';
import { Request, Response } from 'express';
import settingsService from '@services/settings.services';
import usersService from '@services/users.services';
import schema from '@schemas/settings.schemas.json';

function validateSetting(key: string, value: any): { valid: boolean; message?: string } {
    const setting = (schema as any)[key];
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

function getSettings(req: Request, res: Response) {
    if (!req.user?.id) {
        return res.status(401).json(Unauthorized());
    }

    try {
        const settings = settingsService.getSettings(req.user.id);
        return res.status(200).json(OK('Settings successfully retrieved', { settings }));
    } catch (error) {
        return res.status(500).json(InternalServerError('Failed to retrieve settings'));
    }
}

function updateSettings(req: Request, res: Response) {
    if (!req.user?.id) {
        return res.status(401).json(Unauthorized());
    }

    const { settings } = req.body;

    try {
        // Validate new setting changes
        for (const [key, value] of Object.entries(settings)) {
            const result = validateSetting(key, value);
            if (!result.valid) {
                return res.status(400).json(BadRequest(result.message));
            }
        }

        const lastModified = settingsService.updateSettings(req.user.id, settings);

        return res.status(200).json(OK('Settings updated successfully', { settings: { lastModified }}));
    } catch (error) {
        return res.status(500).json(InternalServerError('Failed to update settings'));
    }
}

function getProfile(req: Request, res: Response) {
    if (!req.user?.id) {
        return res.status(401).json(Unauthorized());
    }
    
    try {
        const user = usersService.getUserById(req.user.id);
        return res.status(200).json(OK('Profile retrieved successfully', { profile: user }));
    } catch (error) {
        return res.status(500).json(InternalServerError('Failed to retrieve profile'));
    }
}

export default {
    getSettings,
    updateSettings,
    getProfile
}