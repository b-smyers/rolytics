require('dotenv').config();
require('module-alias/register');
const express = require('express');
const https = require('https');
const http = require('http');
const path = require('path');
const fs = require('fs');
const app = require('./app');

const domain = process.env.NODE_ENV == 'production' ? process.env.PRODUCTION_DOMAIN : `localhost`

// Setup https server
const key = fs.readFileSync(path.join(__dirname, '../key.pem'));
const cert = fs.readFileSync(path.join(__dirname, '../cert.pem'));
const credentials = { key: key, cert: cert };

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(process.env.HTTPS_PORT, () => {
    console.log(`HTTPS server listening: https://${domain}:${process.env.HTTPS_PORT}`);
});

// Setup http server to redirect traffic to https server
const httpApp = express();
httpApp.all('*', (req, res) => res.redirect(301, `https://${domain}:${process.env.HTTPS_PORT}${req.originalUrl}`));

const httpServer = http.createServer(httpApp);

httpServer.listen(process.env.HTTP_PORT, () => {
    console.log(`HTTP server listening: http://${domain}:${process.env.HTTP_PORT}`)
});