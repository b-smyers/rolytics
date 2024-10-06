const fs = require('fs');
const path = require('path');

const logsDirectory = path.join(__dirname, '../../logs');
const trafficCsv = path.join(logsDirectory, 'traffic.csv');
const trafficLog = path.join(logsDirectory, 'traffic.log');

if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory, { recursive: true });
}

if (!fs.existsSync(trafficCsv)) {
    const header = 'timestamp,client_ip,method,path,status_code,response_time_ms,user_agent\n';
    fs.writeFileSync(trafficCsv, header);
}

function logTraffic(req, res, next) {
    const startTime = Date.now();

    res.on('finish', () => {
        const timestamp = new Date().toISOString();
        const clientIp = req.headers['x-forwarded-for'] || req.ip;
        const method = req.method;
        const path = req.path;
        const userAgent = req.headers['user-agent'] || 'Unknown';
        const statusCode = res.statusCode;
        const responseTime = Date.now() - startTime;

        const row = `"${timestamp}","${clientIp}","${method}","${path}","${statusCode}","${responseTime}","${userAgent}"\n`;

        // Append csv
        fs.appendFile(trafficCsv, row, (err) => {
            if (err) {
                console.error('Failed to write to traffic csv file:', err);
            }
        });

        const log = `[${timestamp}] ${clientIp} ${method} ${statusCode} '${path}' response-time-ms: ${responseTime} user-agent: ${userAgent}\n`;

        // Append log
        fs.appendFile(trafficLog, log, (err) => {
            if (err) {
                console.error('Failed to write to traffic log file:', err);
            }
        });
    });

    next();
}

module.exports = logTraffic;