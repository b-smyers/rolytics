async function getActive(req, res) {
    res.status(501).json({ message: 'Route not implemented' });
}

async function getNew(req, res) {
    res.status(501).json({ message: 'Route not implemented' });
}

async function getReturning(req, res) {
    res.status(501).json({ message: 'Route not implemented' });
}

async function getDemographics(req, res) {
    res.status(501).json({ message: 'Route not implemented' });
}

module.exports = {
    getActive,
    getNew,
    getReturning,
    getDemographics,
}