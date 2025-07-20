import { BadRequest, NotFound, OK, Unauthorized } from "@lib/api-response";
import { Request, Response } from "express";
import experiencesService from '@services/experiences.services';
import placesService from '@services/places.services';
import metricsService from '@services/metrics.services';

function getSocial(req: Request, res: Response) {
    if (!req.user?.id) {
        return res.status(401).json(Unauthorized());
    }

    const params = req.query;
    const place_id: number = Number(params.place_id);

    if (!place_id) {
        return res.status(400).json(BadRequest('Missing place ID'));
    }

    // Check if the user owns the place
    let place = placesService.getPlaceById(place_id);

    if (!place) {
        return res.status(404).json(NotFound());
    }

    const experience = experiencesService.getExperienceById(place.experience_id);

    if (experience?.user_id !== req.user.id) {
        return res.status(401).json(Unauthorized());
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
    const social = JSON.parse(place!.social);

    // Get keys (exclude 'timestamp')
    const keys = social && social[0] ? Object.keys(social[0]).filter(key => key !== 'timestamp') : [];

    return res.status(200).json(OK('Social data successfully retrieved', { keys, data: social }));
}

export default{
    getSocial,
}