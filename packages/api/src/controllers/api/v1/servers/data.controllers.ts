import { BadRequest, InternalServerError, OK } from "@lib/api-response";
import { Request, Response } from "express";
import metricsService from '@services/metrics.services';
import placesService from '@services/places.services';
import serversService from '@services/servers.services';
import logger from '@services/logger.services';
import { ajv } from '@services/validators.services';
import { Metric } from "types/metrics";


function logData(req: Request, res: Response) {
    // Check if the req.body exists
    const data = req.body as Metric;
    if (!data) {
        return res.status(400).json(BadRequest('Missing data'));
    }

    // Check data against schema
    const validate = ajv.getSchema("data");
    if (!validate) {
        logger.error('Failed to get validation function for \'data\'');
        return res.status(500).json(InternalServerError());
    }

    if (!validate(data)) {
        logger.info(validate.errors as any);
        return res.status(400).json(BadRequest('Invalid data'));
    }

    // Get internal place id
    const place = placesService.getPlaceByRobloxPlaceId(data.metadata.place.id);
    if (!place) {
        return res.status(400).json(BadRequest());
    }

    // Check if the server has been opened
    const server = serversService.getServerByRobloxServerIdAndPlaceId(data.metadata.server.id, place.place_id);
    if (!server || !server.active) {
        return res.status(400).json(BadRequest('Server not opened'));
    }

    const {
        purchases,
        performance,
        social,
        players,
        metadata
    } = data;

    // Write payload
    metricsService.createMetric(server.server_id, metadata.timestamp, purchases, performance, social, players, metadata);

    res.status(200).json(OK('Data successfully recieved'));
}

export default {
    logData,
};
