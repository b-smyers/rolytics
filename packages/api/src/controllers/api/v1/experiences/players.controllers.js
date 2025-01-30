const experiencesService = require('@services/experiences.services.js');
const placesService = require('@services/places.services');
const metricsService = require('@services/metrics.services');

async function getPlayers(req, res) {
    const { experience_id } = req.query;

    if (!experience_id) {
        return res.status(400).json({
            code: 400,
            status: 'error',
            data: {
                message: 'Missing experience ID'
            }
        });
    }

    // Check if the user owns the experience
    let experience = await experiencesService.getExperienceById(experience_id);

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
    const lastComputedAt = new Date(experience.last_computed_at);
    if (lastComputedAt < new Date(Date.now() - process.env.EXPERIENCE_STALE_TIME)) {
        // Check if any of the places are stale
        const places = await placesService.getPlacesByExperienceId(experience_id);
        // Re-aggregate place if stale
        for (const place of places) {
            const lastComputedAt = new Date(place.last_computed_at);
            if (lastComputedAt < new Date(Date.now() - process.env.PLACE_STALE_TIME)) {
                await metricsService.aggregatePlaceMetrics(place.place_id);
            }
        }
        await metricsService.aggregateExperienceMetrics(experience_id);
    }

    experience = await experiencesService.getExperienceById(experience_id);
    const players = JSON.parse(experience.players);

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