const jwt = require('jsonwebtoken');
const requestCounts = {};

const REQUESTS_PER_MINUTE = 100;
const BUFFER_FACTOR = 1.1; // 10% buffer

const RATE_LIMIT = Math.ceil(REQUESTS_PER_MINUTE * BUFFER_FACTOR);
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute (ms)

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect("/login");
    }
};

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

const authenticateTokenOrApiKey = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'
    const apiKey = req.headers['x-api-key'];

    if (token) {
        // Verify JWT token
        jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403); // Invalid Token
            }
            req.userId = decoded.userId;
            next();
        });
    } else if (apiKey) {
        // Verify API key
        jwt.verify(apiKey, process.env.JWT_API_KEY_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403); // Invalid Token
            }
            req.userId = decoded.userId;
            req.experienceId = decoded.experienceId;
            next();
        });
    } else {
        return res.status(401); // Missing Token or API Key
    }
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
    isAuthenticated,
    rateLimit,
    authenticateTokenOrApiKey,
};
