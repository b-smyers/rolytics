# roblox-analytics
Developing a roblox analytics service website.
Currently the application is being developed as a Node.js Express app. The plan is to develop all the API and neccesarry authentication first, and then migrate the project front-end to Next.js or Vue.js.
The webpage mockup can be found [Here](https://docs.google.com/presentation/d/116s5YVGM6NIPPU6NY0C7b-ReEaT_VP3GaT1PEz7PMvg/edit?usp=sharing)

## Basic Setup
### Environment Setup
Copy the `.env-sample` file to `.env` and fill in the required values.
You can generate your secure keys using openssl (ie. `openssl rand -base64 64`)
```txt
HTTP_PORT=5000
NODE_ENV=<development or production>
SESSION_SECRET=<insert session secret>
JWT_API_KEY_SECRET=<insert api key secret>
```

### Install Dependencies
```bash
npm install
```

### Install Production Dependencies
#### Setup PM2
PM2, a process manager for Node.js that handles monitoring, scaling, and auto-restarts.
```bash
sudo npm install pm2 -g
pm2 start npm --name "rolytics" --max-restarts 5 --no-autostart -- start
```
Next setup PM2 to start automatically by pasting and running the produced command to finish setup.
```bash
pm2 startup systemd
```
Lastly, save changes to pm2.
```bash
pm2 save
```

#### Setup Nginx
Nginx is a powerful reverse proxy server designed for scaling applications.
```bash
sudo apt install nginx
```
Next, copy the nginx config into `/etc/nginx/conf.d/`, and the error page into `/var/www/html/`.
```bash
sudo cp /path/to/rolytics.conf /etc/nginx/conf.d/
sudo cp /path/to/*.html /var/www/html/
```
Configure, test, and start Nginx.
```bash
sudo ufw allow 'Nginx Full'
sudo nginx -t
sudo systemctl start nginx
```

#### Setup Certbot
Certbot, a tool for automatically obtaining and renewing SSL/TLS certificates from Let's Encrypt.
```bash
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo certbot certonly --nginx
```

You can also test your configuration this far using this command.
```bash
sudo certbot renew --dry-run
```

### Startup
#### Development
Run the server using npm
```bash
npm run start
```

#### Production
Run the server using PM2
```bash
pm2 start rolytics
```

## Troubleshooting
Use freedns to route a free subdomain to your external IP on port 443 (https)
Portforward 443 traffic on your router to the port specified in the code
If you are using WSL you will need to forward the traffic from windows to the WSL instance

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