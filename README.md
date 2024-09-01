# roblox-analytics
Developing a roblox analytics service website.

## Basic Setup
### Enviroment Setup
Copy the `.env-sample` file to `.env` and fill in the required values.
You can generate your secure keys using openssl (ie. `openssl rand -base64 64`)
```txt
HTTPS_PORT=<port>
HTTP_PORT=<port>
NODE_ENV=<development or production>
PRODUCTION_DOMAIN=<insert production domain>
SESSION_SECRET=<insert session secret>
JWT_ACCESS_SECRET=<insert access secret>
JWT_REFRESH_SECRET=<insert refresh secret>
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
pm2 start npm --name "rolytics" --interpreter=authbind --interpreter-args="--deep node" -- start
pm2 save
```
Next setup PM2 to start automatically by pasting and running the produced command to finish setup.
```bash
pm2 startup systemd
```

<!-- #### Setup Certbot
Certbot, a tool for automatically obtaining and renewing SSL/TLS certificates from Let's Encrypt.
```bash
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo certbot certonly --standalone
``` -->

#### Setup Authbind
Authbind, a tool for allowing non-root processes to bind to privileged ports.
```bash
sudo apt-get install authbind
sudo touch /etc/authbind/byport/80
sudo chmod 500 /etc/authbind/byport/80
sudo chown $(whoami) /etc/authbind/byport/80
sudo touch /etc/authbind/byport/443
sudo chmod 500 /etc/authbind/byport/443
sudo chown $(whoami) /etc/authbind/byport/443
```

### Certificates
<!-- #### Development -->
Generate self signed SSL certificate
```bash
openssl genrsa -out localhost.key.pem 2048
openssl req -new -key localhost.key.pem -out csr.pem
openssl x509 -req -days 365 -in localhost.csr.pem -signkey localhost.key.pem -out localhost.cert.pem
```
<!-- #### Production
Nothing to do!
Certbot will automatically renew the certificates and the server will automatically hotswap them. -->

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

*Still doesn't work?*
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
            - /gameplay
            - /engagement
            - /retention
        - /performance
            - /uptime
            - /fps
            - /memory
            - /data-receive
            - /data-send
            - /heartbeat
            - /instances
            - /primitives
            - /moving-primitives
            - /physics-receive
            - /physics-send
            - /physics-step
        - /players
            - /active
            - /new
            - /returning
            - /demographics
        - /purchases
            - /passes
            - /developer-products
            - /subscriptions
        - /social
            - /chats
            - /friend-requests
            - /invites
    - /servers
        - /analytics
            - /gameplay
            - /engagement
            - /retention
        - /performance
            - /uptime
            - /fps
            - /memory
            - /data-receive
            - /data-send
            - /heartbeat
            - /instances
            - /primitives
            - /moving-primitives
            - /physics-receive
            - /physics-send
            - /physics-step
        - /players
            - /active
            - /new
            - /returning
            - /demographics
        - /purchases
            - /passes
            - /developer-products
            - /subscriptions
        - /social
            - /chats
            - /friend-requests
            - /invites