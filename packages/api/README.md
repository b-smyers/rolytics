# Rolytics - API
This is the backend for the [Rolytics Project](https://rolytics.bot.nu).

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
HTTP_PORT=5000
NODE_ENV=production
SESSION_SECRET=<insert session secret>
JWT_API_KEY_SECRET=<insert api key secret>
```

Setup pm2 instance.
```bash
pm2 start pnpm --name "rolytics-api" --max-restarts 5 -- start:api
pm2 save --force
```

### Startup
The pm2 instance should start automatically.
You can start, stop, and restart it with the following commands:
```bash
pm2 start rolytics-api
pm2 stop rolytics-api
pm2 restart rolytics-api
```