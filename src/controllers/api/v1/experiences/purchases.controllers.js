async function getPasses(req, res) {
    res.status(501).json({ message: 'Route not implemented' });
}

async function logPasses(req, res) {
    res.status(501).json({ message: 'Route not implemented' });
}

async function getDeveloperProducts(req, res) {
    res.status(501).json({ message: 'Route not implemented' });
}

async function logDeveloperProducts(req, res) {
    res.status(501).json({ message: 'Route not implemented' });
}

async function getSubscriptions(req, res) {
    res.status(501).json({ message: 'Route not implemented' });
}

async function logSubscriptions(req, res) {
    res.status(501).json({ message: 'Route not implemented' });
}

module.exports = {
    getPasses,
    logPasses,
    getDeveloperProducts,
    logDeveloperProducts,
    getSubscriptions,
    logSubscriptions,
}