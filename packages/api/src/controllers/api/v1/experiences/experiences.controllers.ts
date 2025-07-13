import { Request, Response } from "express";

const experiencesService = require('@services/experiences.services');
const placesService = require('@services/places.services');
const robloxService = require('@services/roblox.services');

function getExperiences(req: Request, res: Response) {
    if (!req.user?.id) {
        return res.status(401).json({
            code: 401,
            status: 'error',
            data: {
                message: 'Unauthorized'
            }
        });
    }

    const rows = experiencesService.getExperiencesByUserId(req.user.id);

    return res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            message: 'Experiences successfully retrieved',
            experiences: rows
        }
    })
}

async function connectExperience(req: Request, res: Response) {
    if (!req.user?.id) {
        return res.status(401).json({
            code: 401,
            status: 'error',
            data: {
                message: 'Unauthorized'
            }
        });
    }

    let {
        roblox_experience_id,
        page_link,
        thumbnail_link,
        name,
        description
    } = req.body;

    if (!roblox_experience_id || !page_link || !name) {
        return res.status(400).json({
            code: 400,
            status: 'error',
            data: {
                message: 'Missing roblox_experience_id, page_link, or name'
            }
        });
    }

    description = description || "";
    thumbnail_link = thumbnail_link || "";

    const userId = req.user.id || false;

    if (!userId) {
        return res.status(400).json({
            code: 400,
            status: 'error',
            data: {
                message: 'Unauthorized'
            }
        });
    }

    // Check account experience cap
    const experienceCount = experiencesService.getExperienceCountByUserId(userId);

    if (experienceCount >= 5) { // TODO: Arbitrary limit for now
        return res.status(400).json({
            code: 400,
            status: 'error',
            data: {
                message: 'Experience connection limit reached'
            }
        });
    }

    // Check for pre-existing experience
    const existingExperiences = experiencesService.getExperiencesByUserId(userId);
    // Make sure roblox_experience_id is not in existingExperiences
    const hasExistingExperience = existingExperiences.some((experience: any) => experience.roblox_experience_id === roblox_experience_id);

    if (hasExistingExperience) {
        return res.status(400).json({
            code: 400,
            status: 'error',
            data: {
                message: 'Experience already connected'
            }
        });
    }

    const experience_id = experiencesService.createExperience(roblox_experience_id, userId, name, description, page_link, thumbnail_link);

    // Get places from Roblox API
    const places = await robloxService.getPlacesByRobloxExperienceId(roblox_experience_id);
    if (places.length) {
        Promise.all(places.map((place: any) => {
            placesService.createPlace(place.id, experience_id, place.name);
        }));
    }

    return res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            message: 'Experience successfully connected'
        }
    })
}

function disconnectExperience(req: Request, res: Response) {
    return res.status(501).json({ message: 'Route not implemented' });
}

const experiencesController = {
    getExperiences,
    connectExperience,
    disconnectExperience,
}

export default experiencesController;