const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        req.user = req.session.user;
        next();
    } else {
        res.status(401).json({
            status: 'error',
            message: 'Your session has expired.',
            code: 401,
            data: null
        });
    }
};

const checkJwtToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 'error',
            message: 'Missing Token',
            code: 401,
            data: null    
        });
    }
    const token = authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'

    if (token) {
        // Verify JWT token
        jwt.verify(token, process.env.JWT_API_KEY_SECRET, { algorithms: ['HS256'] }, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({
                        status: 'error',
                        message: 'Token Expired',
                        code: 401,
                        data: null 
                    });
                }
                return res.status(403).json({
                    status: 'error',
                    message: 'Token Invalid',
                    code: 403,
                    data: null
                });
            }
            
            req.user = decoded;
            next();
        });
    } else {
        return res.status(401).json({
            status: 'error',
            message: 'Missing Token',
            code: 401,
            data: null
        }); // Missing token
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
        res.status(401).json({
            status: 'error',
            message: 'Authentication failed',
            code: 401,
            data: null
        });
    }
};

module.exports = {
    authenticate
};
