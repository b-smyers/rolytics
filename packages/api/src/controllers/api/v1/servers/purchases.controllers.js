async function getPasses(req, res) {
    res.status(501).json({ message: 'Route not implemented' });
}

async function getDeveloperProducts(req, res) {
    res.status(501).json({ message: 'Route not implemented' });
}

async function getSubscriptions(req, res) {
    res.status(501).json({ message: 'Route not implemented' });
}

module.exports = {
    getPasses,
    getDeveloperProducts,
    getSubscriptions,
}