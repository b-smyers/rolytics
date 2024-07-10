const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
const { rateLimit, authenticateToken } = require('./middlware/auth.middleware');

app.use('/api', rateLimit);
app.use('/api/users', authenticateToken);
app.use('/api/auth', require('./routers/auth.routes'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'landing.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'home.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'login.html'));
});

// Disallow web-crawlers
app.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'robots.txt'));
});

// Serve custom 404
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'missing.html'));
})

module.exports = app;