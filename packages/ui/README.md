# Rolytics - UI
This is the frontend of the [Rolytics Project](https://rolytics.bot.nu).

## Developement
### Setup
No setup needed yet.

### Startup
Running just the devlopment UI can be accomplished like so:
```bash
pnpm dev:ui
```

## Production
### Setup
Setup pm2 instance.
```bash
pm2 start pnpm --name "rolytics-ui" --max-restarts 5 -- start:ui
pm2 save --force
```

### Startup
The pm2 instance should start automatically.
You can start, stop, and restart it with the following commands:
```bash
pm2 start rolytics-ui
pm2 stop rolytics-ui
pm2 restart rolytics-ui
```