const jwt = require('jsonwebtoken');

const checkSession = (req, res, next) => {
    if (req.session.user) {
        req.user = req.session.user;
        next();
    } else {
        res.status(401).json({
            code: 401,
            status: 'error',
            data: {
                message: 'Session expired'
            }
        });
    }
};

const checkJWTToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            code: 401,
            status: 'error',
            data: {
                message: 'Missing token'
            }
        });
    }
    const token = authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'

    if (token) {
        // Verify JWT token
        jwt.verify(token, process.env.JWT_API_KEY_SECRET, { algorithms: ['HS256'] }, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({
                        code: 401,
                        status: 'error',
                        data: {
                            message: 'Token expired'
                        }
                    });
                }
                return res.status(403).json({
                    code: 403,
                    status: 'error',
                    data: {
                        message: 'Token invalid'
                    }
                });
            }
            
            req.user = decoded;
            next();
        });
    } else {
        return res.status(401).json({
            code: 401,
            status: 'error',
            data: {
                message: 'Token missing'
            }
        });
    }
};

const authenticate = (req, res, next) => {
    if (req.headers['authorization']) {
        // External request
        checkJWTToken(req, res, next);
    } else if (req.session.user) {
        // Internal request
        checkSession(req, res, next);
    } else {
        res.status(401).json({
            code: 401,
            status: 'error',
            data: {
                message: 'Authentication failed'
            }
        });
    }
};

module.exports = {
    authenticate
};
