const experiencesService = require('@services/experiences.services'); 

async function getPlaces(req, res) {
    return res.status(501).json({ message: 'Route not implemented' });
}

module.exports = {
    getPlaces
}