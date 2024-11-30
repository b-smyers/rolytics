const serverService = require('@services/servers.services');

async function getPerformance(req, res) {
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

    const rows = await serverService.getServerMetrics(serverId);

    const performanceData = rows.map(row => {
        return row.performance;
    })

    return res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            message: 'Performance data successfully retrieved',
            data: performanceData
        }
    })
}

module.exports = {
    getPerformance
}