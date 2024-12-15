async function getPlayers(req, res) {
    return res.status(501).json({ message: 'Route not implemented' });
}

module.exports = {
    getPlayers,
}