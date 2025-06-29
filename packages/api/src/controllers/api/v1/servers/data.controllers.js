const metricsService = require('@services/metrics.services');
const placesService = require('@services/places.services');
const serversService = require('@services/servers.services');
const logger = require('@services/logger.services');
const Ajv = require("ajv");

const schema = require('@schemas/data.schemas.json');

const ajv = new Ajv();
const validate = ajv.compile(schema);

function logData(req, res) {
    // Check if the req.body exists
    const data = req.body;
    if (!data) {
        return res.status(400).json({
            code: 400,
            status: 'error',
            data: {
                message: 'Missing data'
            }
        });
    }

    // Check data against schema
    const valid = validate(data);
    if (!valid) {
        logger.info(validate.errors);
        return res.status(400).json({
            code: 400,
            status: 'error',
            data: {
                message: 'Invalid data'
            }
        });
    }

    // Get internal place id
    const place = placesService.getPlaceByRobloxPlaceId(data.metadata.place.id);
    // Check if the server has been opened
    const server = serversService.getServerByRobloxServerIdAndPlaceId(data.metadata.server.id, place.place_id);
    if (!server || !server.active) {
        return res.status(400).json({
            code: 400,
            status: 'error',
            data: {
                message: 'Server not opened'
            }
        });
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

    res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            message: 'Data successfully recieved'
        }
    });
}

module.exports = {
    logData
}
