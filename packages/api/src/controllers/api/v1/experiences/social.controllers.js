async function getChats(req, res) {
    res.status(501).json({ message: 'Route not implemented' });
}

async function getFriendRequests(req, res) {
    res.status(501).json({ message: 'Route not implemented' });
}

async function getInvites(req, res) {
    res.status(501).json({ message: 'Route not implemented' });
}

module.exports = {
    getChats,
    getFriendRequests,
    getInvites,
}