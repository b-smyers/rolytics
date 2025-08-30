# Rolytics - API
This is the backend for the [Rolytics Project](https://rolytics.bot.nu).

[Back](../../README.md)

## Developement
### Setup
**ENV**
Copy the `.env-sample` file to `.env` and fill in the required values.
You can generate your secure keys using openssl (ie. `openssl rand -base64 64`)
```txt
HTTP_PORT=5000
NODE_ENV=development
SESSION_SECRET=<insert session secret>
JWT_API_KEY_SECRET=<insert api key secret>
EXPERIENCE_STALE_TIME=60000 # 1 minute
PLACE_STALE_TIME=60000 # 1 minutes
METRIC_MAX_AGE=259200000 # 3 days
METRIC_CLEANUP_CRON=0 0 * * * # daily at midnight
```

### Startup
Running just the devlopment API can be accomplished like so:
```bash
pnpm dev:api
```

## Production
### Setup
**ENV**
Copy the `.env-sample` file to `.env` and fill in the required values.
You can generate your secure keys using openssl (ie. `openssl rand -base64 64`)
```txt
HTTP_PORT=(Overwritten by Docker)
NODE_ENV=(Overwritten by Docker)
SESSION_SECRET=<insert session secret>
JWT_API_KEY_SECRET=<insert api key secret>
EXPERIENCE_STALE_TIME=60000 # 1 minute
PLACE_STALE_TIME=60000 # 1 minutes
METRIC_MAX_AGE=259200000 # 3 days
METRIC_CLEANUP_CRON=0 0 * * * # daily at midnight
```

### Startup
```bash
sudo docker-compose build
sudo docker-compose up
```