const experiencesService = require('@services/experiences.services');
const placesService = require('@services/places.services');
const analyticsService = require('@services/analytics.services');

async function getSocial(req, res) {
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
        await analyticsService.aggregatePlaceMetrics(place_id);
    }

    place = await placesService.getPlaceById(place_id);
    const social = JSON.parse(place.social);
    
    // Get keys (exclude 'timestamp')
    const keys = social && social[0] ? Object.keys(social[0]).filter(key => key !== 'timestamp') : [];

    return res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            message: 'Social data successfully retrieved',
            keys,
            data: social
        }
    });
}

module.exports = {
    getSocial,
}