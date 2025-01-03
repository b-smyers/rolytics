const experiencesService = require('@services/experiences.services');
const placesService = require('@services/places.services');
const serversService = require('@services/servers.services');
const analyticsService = require('@services/analytics.services');

async function getSocial(req, res) {
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

    const social = await analyticsService.getSocialMetricsByServerId(server.server_id);

    // Decode each row into JSON
    social.forEach((row, index) => {
        social[index] = JSON.parse(row.social);
    });

    // Create list of keys
    const keys = social && social[0] ? Object.keys(social[0]) : [];

    return res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            message: 'Social data successfully retrieved',
            keys,
            social
        }
    })
}

module.exports = {
    getSocial
}