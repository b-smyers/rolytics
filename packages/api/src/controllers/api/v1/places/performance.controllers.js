const experiencesService = require('@services/experiences.services');
const placesService = require('@services/places.services');
const analyticsService = require('@services/analytics.services');

async function getPerformance(req, res) {
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
    let place = await placesService.getPlaceById(place_id);
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

    // If the data is stale, recompute it
    const lastComputedAt = new Date(place.last_computed_at);
    const STALE_TIME = 5 * 60 * 1000;
    if (lastComputedAt < new Date(Date.now() - STALE_TIME)) {
        console.log("Data is stale, recomputing");
        await analyticsService.aggregatePlaceMetrics(place_id);
    }

    place = await placesService.getPlaceById(place_id);
    const performance = JSON.parse(place.performance);

    // Decode each row into JSON
    const keys = performance && performance[0] ? Object.keys(performance[0]) : [];

    return res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            message: 'Performance data successfully retrieved',
            keys,
            performance
        }
    });
}

module.exports = {
    getPerformance,
}