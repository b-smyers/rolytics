const analyticsService = require('@services/analytics.services');

async function getPurchases(req, res) {
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

    const purchasesData = rows.map(row => {
        return row.purchases;
    })

    return res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            message: 'Purchases data successfully retrieved',
            data: purchasesData
        }
    })
}

module.exports = {
    getPurchases
}