const experiencesService = require('@services/experiences.services');
const placesService = require('@services/places.services');
const metricsService = require('@services/metrics.services');

function getPlayers(req, res) {
    const { place_id } = req.query;

    if (!place_id) {
        return res.status(400).json({
            code: 400,
            status: 'error',
            data: {
                message: 'Missing place ID'
            }
        });
    }

    // Check if the user owns the place
    let place = placesService.getPlaceById(place_id);
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

    // If the data is stale, recompute it
    const lastComputedAt = new Date(place.last_computed_at);
    if (lastComputedAt < new Date(Date.now() - process.env.PLACE_STALE_TIME)) {
        metricsService.aggregatePlaceMetrics(place_id);
    }

    place = placesService.getPlaceById(place_id);
    const players = JSON.parse(place.players);

    // Get keys (exclude 'timestamp')
    const keys = players && players[0] ? Object.keys(players[0]).filter(key => key !== 'timestamp') : [];

    return res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            message: 'Players data successfully retrieved',
            keys,
            data: players
        }
    });
}

module.exports = {
    getPlayers,
}