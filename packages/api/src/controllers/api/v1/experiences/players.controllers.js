const experiencesService = require('@services/experiences.services.js');
const placesService = require('@services/places.services.js');
const serversService = require('@services/servers.services.js');
const analyticsService = require('@services/analytics.services.js');

async function getPlayers(req, res) {
    const { experience_id } = req.query;

    if (!experience_id) {
        return res.status(400).json({
            code: 400,
            status: 'error',
            data: {
                message: 'Missing experience experience_id'
            }
        });
    }

    const experience = await experiencesService.getExperienceById(experience_id);
    // Make sure they own the experience
    if (experience.user_id !== req.user.id) {
        return res.status(403).json({
            code: 403,
            status: 'error',
            data: {
                message: 'Unauthorized'
            }
        });
    }

    const data = experience.players; // JSON string

    // TODO: Implement logic to retrieve players data
    // Probably a bottom up approach
    // Server data is aggreated into place data
    // Place data is aggregated into experience data
    // fetch experience data
    // Random number
    const random = Math.floor(Math.random() * 10);

    return res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            message: 'Successfully retrieved players data',
            analytics: {
                keys: ["active", "free", "premium", "returning"],
                data: [
                    { time: '-2:00', active: 20 - random, free: 10, premium: 9, returning: 18 },
                    { time: '-1:45', active: 30, free: 20 + random, premium: 7, returning: 12 - random },
                    { time: '-1:30', active: 25 + random, free: 15, premium: 4, returning: 10 },
                    { time: '-1:15', active: 15, free: 10, premium: 7, returning: 11 },
                    { time: '-1:00', active: 20 + random, free: 15 - random, premium: 4, returning: 10 + random },
                    { time: '-0:45', active: 50 - random, free: 30, premium: 5, returning: 12 },
                    { time: '-0:30', active: 60, free: 50, premium: 2, returning: 26 },
                    { time: '-0:15', active: 44, free: 40, premium: 1 + random, returning: 12 - random },
                    { time: '0:00', active: 55 + random, free: 50, premium: 0, returning: 22 }
                ]
            }
        }
    });
}

module.exports = {
    getPlayers,
}