const experiencesService = require('@services/experiences.services');
const placesService = require('@services/places.services');
const metricsService = require('@services/metrics.services');

async function getPurchases(req, res) {
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
    if (lastComputedAt < new Date(Date.now() - process.env.PLACE_STALE_TIME)) {
        await metricsService.aggregatePlaceMetrics(place_id);
    }

    place = await placesService.getPlaceById(place_id);
    const purchases = JSON.parse(place.purchases);

    // Get keys (exclude 'timestamp')
    const keys = purchases && purchases[0] ? Object.keys(purchases[0]).filter(key => key !== 'timestamp') : [];

    return res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            message: 'Purchases data successfully retrieved',
            keys,
            data: purchases
        }
    });
}

module.exports = {
    getPurchases,
}