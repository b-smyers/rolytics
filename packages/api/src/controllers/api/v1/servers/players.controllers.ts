import { BadRequest, OK, Unauthorized } from "@lib/api-response";
import { Request, Response } from "express";
import experiencesService from '@services/experiences.services';
import placesService from '@services/places.services';
import serversService from '@services/servers.services';
import metricsService from '@services/metrics.services';

function getPlayers(req: Request, res: Response) {
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

    const players = metricsService.getPlayersMetricsByServerId(server.server_id);

    // Decode each row into JSON
    players.forEach((row: any, index: string) => {
        players[index] = JSON.parse(row.players);
    });

    // Create list of keys
    const keys = players && players[0] ? Object.keys(players[0]) : [];

    return res.status(200).json(OK('Players data successfully retrieved', { keys, data: players }));
}

export default {
    getPlayers,
}