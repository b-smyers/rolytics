require('dotenv').config();
require('module-alias/register');
const http = require('http');
const app = require('./app');
const logger = require('@services/logger.services');

// Setup http server
const httpServer = http.createServer(app);

httpServer.on('clientError', (error, socket) => {
    console.error(error);

    if (error) {
        socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    } else {
        socket.destroy(); // No memory leak today!
    }
});

httpServer.listen(process.env.HTTP_PORT, () => {
    logger.info(`HTTP server listening: http://localhost:${process.env.HTTP_PORT}`)
});