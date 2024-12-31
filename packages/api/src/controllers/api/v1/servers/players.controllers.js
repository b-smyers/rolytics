const analyticsService = require('@services/analytics.services');

async function getPlayers(req, res) {
    const { serverId } = req.body;

    if (!serverId) {
        return res.status(400).json({
            code: 400,
            status: 'error',
            data: {
                message: 'Missing server ID'
            }
        });
    }

    const rows = await analyticsService.getAnalyticsByServerId(serverId);

    const playersData = rows.map(row => {
        return row.players;
    })

    return res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            message: 'Players data successfully retrieved',
            data: playersData
        }
    })
}

module.exports = {
    getPlayers
}