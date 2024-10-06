async function getGameplay(req, res) {
    res.status(501).json({ message: 'Route not implemented' });
}

async function getEngagement(req, res) {
    res.status(501).json({ message: 'Route not implemented' });
}

async function getRetention(req, res) {
    res.status(501).json({ message: 'Route not implemented' });
}

module.exports = {
    getGameplay,
    getEngagement,
    getRetention,
}