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
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from 'Bearer <token>'

    if (token) {
        // Verify JWT token
        jwt.verify(token, process.env.JWT_API_KEY_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403); // Invalid Token
            }
            req.user = decoded;
            next();
        });
    } else {
        return res.status(401); // Missing token
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
    authenticate,
    rateLimit,
};
