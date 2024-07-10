require('dotenv').config();
const https = require('https');
const path = require('path');
const fs = require('fs');
const app = require('./app');

const key = fs.readFileSync(path.join(__dirname, '../key.pem'));
const cert = fs.readFileSync(path.join(__dirname, '../cert.pem'));
const credentials = { key: key, cert: cert };

const server = https.createServer(credentials, app);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running at http://silk.bot.nu on internal port ${PORT}`);
});