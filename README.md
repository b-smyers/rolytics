# Roytics
**Rolytics** is a powerful analytics and control tool designed specifically for Roblox developers. It provides deeper insights into **social interactions, player engagement, in-game purchases, and performance metrics** that go beyond the standard tools offered by Roblox. Developers can use Rolytics to optimize their experiences and better understand their player base.

## Key Features
- **A/B Testing**: Easily set up and monitor A/B testing campaigns to optimize gameplay elements and improve user experience.
- **Command and Control Center**: The web interface acts as a centralized command hub, enabling remote execution of custom in-server functions for enhanced control and flexibility over your Roblox games.

## Mockup
The webpage mockup can be found [Here](https://docs.google.com/presentation/d/116s5YVGM6NIPPU6NY0C7b-ReEaT_VP3GaT1PEz7PMvg/edit?usp=sharing)

## Prerequisites
- Node.js
- Nginx

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
sudo cp nginx/configs/dev.rolytics.conf /etc/nginx/conf.d/
sudo cp nginx/html/*.html /var/www/html/
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
### 1) Shared Setup
#### PNPM
Install pnpm & the project packages.
```bash
npm install -g pnpm
pnpm install
```

#### NGINX && Certbot
Copy the production config into `/etc/nginx/conf.d/`, and the error page into `/var/www/html/`.
```bash
sudo cp nginx/configs/rolytics.conf /etc/nginx/conf.d/
sudo cp nginx/html/*.html /var/www/html/
```
Configure, test, and start Nginx.
```bash
sudo ufw allow 'Nginx Full'
```
Install Certbot
```bash
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```
You might need a temporary certificate to run Nginx for the first time.
```bash
sudo certbot certonly --standalone -d rolytics.bot.nu
```
Test and run nginx, and enabled automatic renewal with certbot.
```bash
sudo nginx -t
sudo systemctl restart nginx
sudo certbot certonly --nginx
```
At this point you can test the configuration this far by using this command:
```bash
sudo certbot renew --dry-run
```

#### PM2
PM2 is a process manager for Node.js that handles monitoring, auto-scaling, and auto-restarts.
```bash
sudo npm install pm2 -g
```
Next setup PM2 to start automatically by pasting and running the produced command to finish setup.
```bash
pm2 startup systemd
```
Lastly, save changes to pm2.
```bash
pm2 save --force
```
### 2) API Setup
API production [Setup Instructions](packages/api/README.md#production).

### 3) UI Setup
UI production [Setup Instructions](packages/ui/README.md#production).

### 4) Startup
Run the server using PM2
```bash
pm2 start rolytics
```

## Troubleshooting
Use freedns to route a free subdomain to your external IP on port 443 (https)
Portforward 443 traffic on your router to the port specified in the code
If you are using WSL you will need to forward the traffic from windows to the WSL instance

## TODO
- [ ] Implement saving analytics to sqlite databse

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
        - /(Experience Name)
            - /(Server ID)

## API Layout
- /api/v1
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
