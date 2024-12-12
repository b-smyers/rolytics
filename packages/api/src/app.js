const express = require('express');
const session = require('express-session');
const { rateLimit } = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
app.set('trust proxy', 1);
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: 60,               // 60 requests / 1 min
    standardHeaders: 'draft-7',
    legacyHeaders: false
});
app.use(limiter);
app.use(bodyParser.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax'
    }
}));
app.use(cookieParser());
app.use(require('@services/logTraffic.services'));

// Routes
app.use('/api/v1', require('@routes/api/v1/api.routes'));

// Serve custom 404
app.use('/api', (req, res) => {
    res.status(404).json({
        status: 'error',
        messsage: 'Unknown endpoint',
        code: 404,
        data: null
    });
});

module.exports = app;
