const serverService = require('@services/servers.services');

async function getSocial(req, res) {
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

    const socialData = rows.map(row => {
        return row.social;
    })

    return res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            message: 'Social data successfully retrieved',
            data: socialData
        }
    })
}

module.exports = {
    getSocial
}