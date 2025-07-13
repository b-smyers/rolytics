import { Request, Response } from "express";

const experiencesService = require('@services/experiences.services');
const placesService = require('@services/places.services');
const metricsService = require('@services/metrics.services');

function getPlayers(req: Request, res: Response) {
    if (!req.user?.id) {
        return res.status(401).json({
            code: 401,
            status: 'error',
            data: {
                message: 'Unauthorized'
            }
        });
    }

    const { place_id } = req.query;

    if (!place_id) {
        return res.status(400).json({
            code: 400,
            status: 'error',
            data: {
                message: 'Missing place ID'
            }
        });
    }

    // Check if the user owns the place
    let place = placesService.getPlaceById(place_id);
    const experience = experiencesService.getExperienceById(place?.experience_id);

    if (experience?.user_id !== req.user.id) {
        return res.status(403).json({
            code: 403,
            status: 'error',
            data: {
                message: 'Unauthorized'
            }
        });
    }

    // If the data is stale, recompute it
    const PLACE_STALE_TIME_MS = Number(process.env.PLACE_STALE_TIME ?? 0);

    if (Number.isNaN(PLACE_STALE_TIME_MS)) {
        throw new Error("PLACE_STALE_TIME must be a valid number in milliseconds");
    }
    const lastComputedAt = new Date(place.last_computed_at);
    const isStale = lastComputedAt.getTime() < Date.now() - PLACE_STALE_TIME_MS;
    if (isStale) {
        metricsService.aggregatePlaceMetrics(place_id);
    }

    place = placesService.getPlaceById(place_id);
    const players = JSON.parse(place.players);

    // Get keys (exclude 'timestamp')
    const keys = players && players[0] ? Object.keys(players[0]).filter(key => key !== 'timestamp') : [];

    return res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            message: 'Players data successfully retrieved',
            keys,
            data: players
        }
    });
}

module.exports = {
    getPlayers,
}