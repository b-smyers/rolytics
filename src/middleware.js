// Services
const networking = require('./networking');
const tokens = require('./tokenService');

// Basic saftey middleware
function rateLimit(req, res, next) {
    // Check Rate Limit
    const clientIp = req.ip;
    if (networking.isRateLimited(clientIp)) {
        
        return res.status(429).json({
            message: "Rate Limit Reached",
            retryAfter: networking.getRetryAfterTime(clientIp)
        });
    }
    next();
}

function requireToken(req, res, next) {
    // Check Token
    const token = req.headers['x-token'];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }

    if (!tokens.validateToken(token)) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    next();
}

module.exports = {
    rateLimit,
    requireToken,
}