const express = require('express');
const session = require('express-session');
const { rateLimit } = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false
});
app.use(limiter);
app.use(bodyParser.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict'
    }
}));
app.use(cookieParser());
app.use(require('@services/logTraffic.services'));

// Routes
app.use('/api/v1', require('@routes/api/v1/api.routes'));

// Serve custom 404
app.use('/api', (req, res) => {
    res.status(404).json({ messsage: 'Unknown endpoint' });
});

module.exports = app;
