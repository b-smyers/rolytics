# Rolytics
**Rolytics** is a powerful analytics and control tool designed specifically for Roblox developers. It provides deeper insights into **social interactions, player engagement, in-game purchases, and performance metrics** that go beyond the standard tools offered by Roblox. Developers can use Rolytics to optimize their experiences and better understand their player base.

## Key Features
- **A/B Testing**: Easily set up and monitor A/B testing campaigns to optimize gameplay elements and improve user experience.
- **Command and Control Center**: The web interface acts as a centralized command hub, enabling remote execution of custom in-server functions for enhanced control and flexibility over your Roblox games.

## Mockup
The webpage mockup can be found [Here](https://docs.google.com/presentation/d/116s5YVGM6NIPPU6NY0C7b-ReEaT_VP3GaT1PEz7PMvg/edit?usp=sharing)

## Roblox Studio Plugin
Official [Rolytics Plugin](https://create.roblox.com/store/asset/110416944845032/Rolytics-Analytics-Tool)

## Prerequisites
- Node.js
- Nginx
- Docker or docker-compose (production)

## Development
### 1) Shared Setup
#### pnpm
Install pnpm & the project packages.
```bash
npm install -g pnpm
pnpm install
```

#### nginx
Copy the development config into `/etc/nginx/conf.d/`, and the error page into `/var/www/html/`.
```bash
sudo cp packages/proxy/configs/dev.rolytics.conf /etc/nginx/conf.d/
sudo cp packages/proxy/html/*.html /var/www/html/
```
Configure, test, and start Nginx.
```bash
sudo ufw allow 'Nginx Full'
sudo nginx -t
sudo systemctl restart nginx
```

### 2) API Setup
API development [Setup Instructions](packages/api/README.md#developement).

### 3) UI Setup
UI development [Setup Instructions](packages/ui/README.md#development).

### 4) Startup
Start the API and UI with:
```bash
pnpm dev
```

## Production
Run the server using Docker Compose
```bash
sudo docker-compose build
sudo docker-compose up -d
```

## Troubleshooting
Use freedns to route a free subdomain to your external IP on port 443 (https)
Portforward 443 traffic on your router to your server.

## TODO
- [x] Implement saving analytics to sqlite databse
- [x] Automatically delete old analytics data
- [ ] Automatically delete old servers
- [ ] Implement download data button on the experience page
- [x] Add place analytics page
- [ ] Add server analytics page
- [x] Add rolytics plugin tool

## Site Layout
- /      <--(Landing page)
- /login
- /register
- /about
- /updates
- /faq
- /dashboard
    - /account
    - /settings
    - /feedback
    - /experiences
        - /connect
        - /(Experience Name)

## API Layout
- /api/v1
    - /roblox
        - /place-details
    - /auth
        - /login
        - /register
        - /logout
        - /refresh
        - /verify
    - /users
        - /profile
        - /settings
    - /experiences
        - /connect
        - /disconnect
        - /analytics
            - gameplay
            - engagement
            - retention
        - /performance
            - uptime
            - fps
            - memory
            - data-receive
            - data-send
            - heartbeat
            - instances
            - primitives
            - moving-primitives
            - physics-receive
            - physics-send
            - physics-step
        - /players
            - active
            - new
            - returning
            - demographics
        - /purchases
            - passes
            - developer-products
            - subscriptions
        - /social
            - chats
            - friend-requests
            - invites
    - /servers
        - /data
            - logging endpoint
        - /performance
            - uptime
            - fps
            - memory
            - data-receive
            - data-send
            - heartbeat
            - instances
            - primitives
            - moving-primitives
            - physics-receive
            - physics-send
            - physics-step
        - /players
            - active
            - new
            - returning
            - engagement
            - retention
            - demographics
        - /purchases
            - passes
            - developer-products
            - subscriptions
        - /social
            - chats
            - friend-requests
            - invites
