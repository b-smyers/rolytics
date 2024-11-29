const serverService = require('@services/servers.services');

async function getPerformance(req, res) {
    const { serverId } = req.body;

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