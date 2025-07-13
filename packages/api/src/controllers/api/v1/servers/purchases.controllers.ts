import { Request, Response } from "express";

const experiencesService = require('@services/experiences.services');
const placesService = require('@services/places.services');
const serversService = require('@services/servers.services');
const metricsService = require('@services/metrics.services');

function getPurchases(req: Request, res: Response) {
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

    const purchases = metricsService.getPurchasesMetricsByServerId(server.server_id);

    // Decode each row into JSON
    purchases.forEach((row: any, index: string) => {
        purchases[index] = JSON.parse(row.purchases);
    });

    // Create list of keys
    const keys = purchases && purchases[0] ? Object.keys(purchases[0]) : [];

    return res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            message: 'Purchase data successfully retrieved',
            keys,
            purchases
        }
    })
}

const purchasesController = {
    getPurchases
};

export default purchasesController;