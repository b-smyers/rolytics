const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// Services
const networking = require('./networking');
const tokens = require('./tokens');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
const PORT = 8080

const maxLogs = 720;
const logs = [];

// Basic saftey middleware
function APIMiddleware(req, res, next) {
    // Check Rate Limit
    const clientIp = req.ip;
    if (networking.isRateLimited(clientIp)) {
        
        return res.status(429).json({
            message: "Rate Limit Reached",
            retryAfter: networking.getRetryAfterTime(clientIp)
        });
    }

    // Check Token
    const token = req.headers['x-token'];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }

    if (!tokens.validateToken(token)) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    next();
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/data/old', (req, res) => {
    res.status(200).json(logs);
});

app.get('/data/new', (req, res) => {
    res.status(200).json(logs[logs.length - 1]);
});

app.post('/log', APIMiddleware, (req, res) => {
    if (logs.push(req.body) > maxLogs) {
        logs.splice(0, 1);
    }
    res.status(200).json({ message: "Data received successfully" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});