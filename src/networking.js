const requestCounts = {};

const REQUESTS_PER_MINUTE = 100;
const BUFFER_FACTOR = 1.1; // 10% buffer

const RATE_LIMIT = Math.ceil(REQUESTS_PER_MINUTE * BUFFER_FACTOR);
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute (ms)

console.log(`Rate limit set to ${RATE_LIMIT} requests per minute`);

/**
 * Returns the amount of time until an ip can send another request
 * @param {string} ip - an incoming ip address
 * @returns {number} the time the ip should wait before sending another request
 */
function getRetryAfterTime(ip) {
    return !ip || !requestCounts[ip] ? 0 : requestCounts[ip].resetTime - Date.now();
}

/**
 * Returns true if a given ip is currently rate limited
 * @param {string} ip - an incoming ip address
 * @returns {boolean} true if ip is rate limited
 */
function isRateLimited(ip) {
    const now = Date.now();
    if (!requestCounts[ip]) {
        requestCounts[ip] = {
            count: 1,
            resetTime: now + RATE_LIMIT_WINDOW
        };
        return false;
    }

    if (now > requestCounts[ip].resetTime) {
        requestCounts[ip] = {
            count: 1,
            resetTime: now + RATE_LIMIT_WINDOW
        };
        return false;
    }

    requestCounts[ip].count++;
    return requestCounts[ip].count > RATE_LIMIT;
}

// Cleanup old entries periodically
setInterval(() => {
    const now = Date.now();
    for (let ip in requestCounts) {
        if (now > requestCounts[ip].resetTime) {
            delete requestCounts[ip];
        }
    }
}, 60000); // Run every minute

module.exports = {
    getRetryAfterTime,
    isRateLimited,
}