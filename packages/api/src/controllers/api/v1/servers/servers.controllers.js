const placesService = require('@services/places.services'); 

async function getServers(req, res) {
    return res.status(501).json({ message: 'Route not implemented' });
}

module.exports = {
    getServers
}