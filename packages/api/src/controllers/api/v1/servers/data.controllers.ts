import { BadRequest, OK } from "@lib/api-response";
import { Request, Response } from "express";
import metricsService from '@services/metrics.services';
import placesService from '@services/places.services';
import serversService from '@services/servers.services';
import logger from '@services/logger.services';
import Ajv from "ajv";
import schema from '@schemas/data.schemas.json';

const ajv = new Ajv();
const validate = ajv.compile(schema);

function logData(req: Request, res: Response) {
    // Check if the req.body exists
    const data = req.body;
    if (!data) {
        return res.status(400).json(BadRequest('Missing data'));
    }

    // Check data against schema
    const valid = validate(data);
    if (!valid) {
        logger.info(validate.errors);
        return res.status(400).json(BadRequest('Invalid data'));
    }

    // Get internal place id
    const place = placesService.getPlaceByRobloxPlaceId(data.metadata.place.id);
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
