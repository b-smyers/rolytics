const fs = require('fs');
const path = require('path');

const logsDirectory = path.join(__dirname, '../../logs');
const trafficLog = path.join(logsDirectory, 'traffic.log');

if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory, { recursive: true });
}

function logTraffic(req, res, next) {
    const timestamp = new Date().toISOString();
    const clientIp = req.headers['x-forwarded-for'] || req.ip;
    const method = req.method;
    const path = req.path;
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const logMessage = `[${timestamp}] IP: ${clientIp} ${method} '${path}' User-Agent: ${userAgent}\n`;

    fs.appendFile(trafficLog, logMessage, (err) => {
        if (err) {
            console.error('Failed to write to log file:', err);
        }
    });

    next();
}

module.exports = logTraffic;
