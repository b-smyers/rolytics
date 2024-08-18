const jwt = require('jsonwebtoken');
const requestCounts = {};

const REQUESTS_PER_MINUTE = 100;
const BUFFER_FACTOR = 1.1; // 10% buffer

const RATE_LIMIT = Math.ceil(REQUESTS_PER_MINUTE * BUFFER_FACTOR);
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute (ms)

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        req.user = req.session.user;
        next();
    } else {
        res.redirect("/login");
    }
};

const checkJwtToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'

    if (token) {
        // Verify JWT token
        jwt.verify(token, process.env.JWT_API_KEY_SECRET, { algorithms: ['HS256'] }, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: "Token expired" });
                }
                return res.status(403).json({ message: "Invalid Token" });
            }
            
            req.user = decoded;
            next();
        });
    } else {
        return res.status(401).json({ message: "Missing Token" }); // Missing token
    }
};

const authenticate = (req, res, next) => {
    if (req.headers['authorization']) {
        // External request
        checkJwtToken(req, res, next);
    } else if (req.session.user) {
        // Internal request
        isAuthenticated(req, res, next);
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
};

const rateLimit = (req, res, next) => {
    const now = Date.now();
    const ip = req.headers['x-forwarded-for'] || req.ip;
    // Rate limit based on JWT token if possible, because external actors can spoof ip addresses
    const key = req.headers['authorization'] ? req.headers['authorization'] : ip;
    if (!requestCounts[key]) {
        requestCounts[key] = {
            count: 1,
            resetTime: now + RATE_LIMIT_WINDOW
        };
        return next();
    }

    if (now > requestCounts[key].resetTime) {
        requestCounts[key] = {
            count: 1,
            resetTime: now + RATE_LIMIT_WINDOW
        };
        return next();
    }

    requestCounts[key].count++;
    if (requestCounts[key].count > RATE_LIMIT) {
        res.status(429).json({ message: 'Too many requests', retryafter: requestCounts[key].resetTime - Date.now() });
    } else {
        next();
    }
};

// Cleanup old ratelimit entries
setInterval(() => {
    const now = Date.now();
    for (let key in requestCounts) {
        if (now > requestCounts[key].resetTime) {
            delete requestCounts[key];
        }
    }
}, 60 * 1000);

module.exports = {
    authenticate,
    rateLimit,
};
