import 'dotenv/config';
import 'module-alias/register';
import http from 'http';
import app from './app';
import logger from '@services/logger.services';

// Setup http server
const httpServer = http.createServer(app);

httpServer.on('clientError', (error: Error, socket: import('net').Socket) => {
    console.error(error);

    if (error) {
        socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    } else {
        socket.destroy(); // No memory leak today!
    }
});

httpServer.listen(process.env.HTTP_PORT, () => {
    logger.info(`HTTP server listening: http://localhost:${process.env.HTTP_PORT}`);
});