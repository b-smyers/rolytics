const express = require('express');
const session = require('express-session')
const cookieParser = require('cookie-parser');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
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
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
const { authenticate, rateLimit } = require('./middlware/auth.middleware');

app.use('/api', rateLimit);

// Routes
app.use('/api/v1', require('./routers/api.routes'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'homepage.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'login.html'));
});

app.use('/dashboard', authenticate);
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'dashboard.html'));
});

app.get('/dashboard/settings', (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'settings.html'))
});

// Disallow web-crawlers
app.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'robots.txt'));
});

// Serve custom 404
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public', '404.html'));
})

module.exports = app;