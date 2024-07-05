const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// Middlware
const middleware = require('./middleware');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
const PORT = 8080

const maxLogs = 720;
const logs = [];

function compressLogs(logs, newLength) {
    if (logs.length < newLength) { return logs; }

    const compressionInterval = Math.ceil(logs.length / newLength);
    let count = compressionInterval;
    let averages = {};
    let compressedLogs = [];

    // Initialize the averages object keys
    Object.keys(logs[0].Metrics).forEach(point => {
        averages[point] = 0;
    });

    for (let i = 0; i < logs.length; i++) {
        const log = logs[i];

        Object.keys(log.Metrics).forEach(point => {
            averages[point] += log.Metrics[point].Value;
        });

        if (count <= 1) {
            let compressedLog = {
                Metadata: { ...log.Metadata },
                Metrics: {}
            };

            Object.keys(log.Metrics).forEach(point => {
                compressedLog.Metrics[point] = {
                    Value: averages[point] / compressionInterval,
                    Unit: log.Metrics[point].Unit
                };
            });
            compressedLogs.push(compressedLog);

            Object.keys(averages).forEach(point => {
                averages[point] = 0;
            });

            count = compressionInterval;
        } else {
            count--;
        }
    }

    return compressedLogs;
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/api', middleware.rateLimit);
app.use('/api/post', middleware.requireToken);

app.get('/api/get/log/old', (req, res) => {
    const compressedLogs = compressLogs(logs, 50);
    res.status(200).json(logs);
});

app.get('/api/get/log/new', (req, res) => {
    res.status(200).json(logs[logs.length - 1]);
});

app.post('/api/post/log', (req, res) => {
    if (logs.push(req.body) > maxLogs) {
        logs.splice(0, 1);
    }
    res.status(200).json({ message: "Data received successfully" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://silk.bot.nu:${PORT}`);
});