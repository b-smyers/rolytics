import { Request, Response } from "express";

const experiencesService = require('@services/experiences.services');
const placesService = require('@services/places.services');
const serversService = require('@services/servers.services');
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

    const { server_id } = req.query;

    if (!server_id) {
        return res.status(400).json({
            code: 400,
            status: 'error',
            data: {
                message: 'Missing server ID'
            }
        });
    }

    // Check if the user owns the server
    const server = serversService.getServerById(server_id);
    const place = placesService.getPlaceById(server?.place_id);
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

    const players = metricsService.getPlayersMetricsByServerId(server.server_id);

    // Decode each row into JSON
    players.forEach((row: any, index: string) => {
        players[index] = JSON.parse(row.players);
    });

    // Create list of keys
    const keys = players && players[0] ? Object.keys(players[0]) : [];

    return res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            message: 'Players data successfully retrieved',
            keys,
            players
        }
    })
}

const playersController = {
    getPlayers
}

export default playersController;