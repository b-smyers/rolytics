import { BadRequest, OK, Unauthorized } from "@lib/api-response";
import { Request, Response } from "express";
import experiencesService from '@services/experiences.services';
import placesService from '@services/places.services';
import serversService from '@services/servers.services';
import metricsService from '@services/metrics.services';

function getSocial(req: Request, res: Response) {
    if (!req.user?.id) {
        return res.status(401).json(Unauthorized());
    }

    const { server_id } = req.query;

    if (!server_id) {
        return res.status(400).json(BadRequest('Missing server ID'));
    }

    // Check if the user owns the server
    const server = serversService.getServerById(server_id);
    const place = placesService.getPlaceById(server?.place_id);
    const experience = experiencesService.getExperienceById(place?.experience_id);

    if (experience?.user_id !== req.user.id) {
        return res.status(401).json(Unauthorized());
    }

    const social = metricsService.getSocialMetricsByServerId(server.server_id);

    // Decode each row into JSON
    social.forEach((row: any, index: string) => {
        social[index] = JSON.parse(row.social);
    });

    // Create list of keys
    const keys = social && social[0] ? Object.keys(social[0]) : [];

    return res.status(200).json(OK('Social data successfully retrieved', { keys, data: social }));
}

export default {
    getSocial
}