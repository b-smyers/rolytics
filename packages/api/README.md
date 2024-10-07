# Rolytics - API
This is the backend for the [Rolytics Project](https://rolytics.bot.nu).

## Developement
***
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
***
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

### Startup
To run just the production API you can run:
```bash
pnpm start:api
```