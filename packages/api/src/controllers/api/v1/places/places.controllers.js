const placesService = require('@services/places.services'); 

async function getPlaces(req, res) {
    const { experience_id } = req.query;

    const rows = await placesService.getPlacesByExperienceId(experience_id);

    return res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            message: 'Places successfully retrieved',
            places: rows
        }
    })
}

module.exports = {
    getPlaces
}