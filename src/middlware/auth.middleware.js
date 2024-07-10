const jwt = require('jsonwebtoken');
const requestCounts = {};

const REQUESTS_PER_MINUTE = 100;
const BUFFER_FACTOR = 1.1; // 10% buffer

const RATE_LIMIT = Math.ceil(REQUESTS_PER_MINUTE * BUFFER_FACTOR);
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute (ms)

const rateLimit = (req, res, next) => {
    const now = Date.now();
    const ip = req.headers['x-forwarded-for'] || req.ip;
    if (!requestCounts[ip]) {
        requestCounts[ip] = {
            count: 1,
            resetTime: now + RATE_LIMIT_WINDOW
        };
        return next();
    }

    if (now > requestCounts[ip].resetTime) {
        requestCounts[ip] = {
            count: 1,
            resetTime: now + RATE_LIMIT_WINDOW
        };
        return next();
    }

    requestCounts[ip].count++;
    if (requestCounts[ip].count > RATE_LIMIT) {
        res.status(429).json({ message: 'Too many requests', retryafter: requestCounts[ip].resetTime - Date.now() });
    } else {
        next();
    }
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'

    if (token == null) {
        return res.sendStatus(401); // Missing Token
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Invalid Token
        }

        req.user = user; // Attach decoded JWT token data to request
        next();
    });
};

// Cleanup old ratelimit entries
setInterval(() => {
    const now = Date.now();
    for (let ip in requestCounts) {
        if (now > requestCounts[ip].resetTime) {
            delete requestCounts[ip];
        }
    }
}, 60 * 1000);

module.exports = {
    rateLimit,
    authenticateToken,
};