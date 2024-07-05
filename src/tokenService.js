const fs = require('fs').promises;
const tokens = require('./tokens.json');

function validateToken(token) {
    return tokens.valid_tokens.includes(token);
}

module.exports = {
    validateToken,
}

// Create token
// https://www.random.org/strings/?num=1&len=32&digits=on&upperalpha=on&loweralpha=on&unique=on&format=html&rnd=new