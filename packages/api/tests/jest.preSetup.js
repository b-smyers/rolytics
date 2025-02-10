process.env.HTTP_PORT = 5000;
process.env.NODE_ENV = 'test';
process.env.SESSION_SECRET = 'session_secret';
process.env.JWT_API_KEY_SECRET = 'jwt_api_key_secret';
process.env.EXPERIENCE_STALE_TIME = 60000;
process.env.PLACE_STALE_TIME = 60000;
process.env.METRIC_MAX_AGE = 259200000;
process.env.METRIC_CLEANUP_CRON = '0 0 * * *';
require('dotenv').config();