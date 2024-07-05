const fs = require('fs').promises;
const validTokens = require('./validTokens');

function validateToken(token) {
    return validTokens.includes(token)
}

module.exports = {
    validateToken,
}