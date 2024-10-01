async function getUptime(req, res) {
    res.status(501).json({ message: 'Route not implemented' });
}

async function getFps(req, res) {
    res.status(501).json({ message: 'Route not implemented' });
}

async function getMemory(req, res) {
    res.status(501).json({ message: 'Route not implemented' });
}

async function getDataReceive(req, res) {
    res.status(501).json({ message: 'Route not implemented' });
}

async function getDataSend(req, res) {
    res.status(501).json({ message: 'Route not implemented' });
}

async function getHeartbeat(req, res) {
    res.status(501).json({ message: 'Route not implemented' });
}

async function getInstances(req, res) {
    res.status(501).json({ message: 'Route not implemented' });
}

async function getPrimitives(req, res) {
    res.status(501).json({ message: 'Route not implemented' });
}

async function getMovingPrimitives(req, res) {
    res.status(501).json({ message: 'Route not implemented' });
}

async function getPhysicsReceive(req, res) {
    res.status(501).json({ message: 'Route not implemented' });
}

async function getPhysicsSend(req, res) {
    res.status(501).json({ message: 'Route not implemented' });
}

async function getPhysicsStep(req, res) {
    res.status(501).json({ message: 'Route not implemented' });
}

module.exports = {
    getUptime,
    getFps,
    getMemory,
    getDataReceive,
    getDataSend,
    getHeartbeat,
    getInstances,
    getPrimitives,
    getMovingPrimitives,
    getPhysicsReceive,
    getPhysicsSend,
    getPhysicsStep,
}