const experiencesService = require('@services/experiences.services');
const placesService = require('@services/places.services');
const serversService = require('@services/servers.services');
const analyticsService = require('@services/analytics.services');

async function getPerformance(req, res) {
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
    const server = await serversService.getServerById(server_id);
    const place = await placesService.getPlaceById(server?.place_id);
    const experience = await experiencesService.getExperienceById(place?.experience_id);

    if (experience?.user_id !== req.user.id) {
        return res.status(403).json({
            code: 403,
            status: 'error',
            data: {
                message: 'Unauthorized'
            }
        });
    }

    const performance = await analyticsService.getPerformanceMetricsByServerId(server.server_id);

    // Decode each row into JSON
    performance.forEach((row, index) => {
        performance[index] = JSON.parse(row.performance);
    });

    // Create list of keys
    const keys = performance && performance[0] ? Object.keys(performance[0]) : [];

    return res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            message: 'Performance data successfully retrieved',
            keys,
            performance
        }
    })
}

module.exports = {
    getPerformance
}