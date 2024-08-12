const express = require('express');
const session = require('express-session')
const cookieParser = require('cookie-parser');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 60 * 60 * 1000
    }
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
const { isAuthenticated, rateLimit, authenticateTokenOrApiKey } = require('./middlware/auth.middleware');

app.use('/api', rateLimit);
app.use('/api/v1/users', isAuthenticated);

// Routes
app.use('/api/v1/auth', require('./routers/auth.routes'));
app.use('/api/v1/users', require('./routers/users.routes'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'landing.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'login.html'));
});

app.use('/home', isAuthenticated);
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'home.html'));
});

app.get('/home/settings', (req, res) => {
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