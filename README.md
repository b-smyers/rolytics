# roblox-analytics
Developing a roblox analytics service with accounts.

## Basic Setup
Generate self signed SSL certificate
```bash
openssl genrsa -out key.pem 2048
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem
```
Fill out the `.env-sample` and rename it to `.env`
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
Install dependencies
```bash
npm install
```
Run the server
```bash
npm run start
```

*Still doesn't work?*
Use freedns to route a free subdomain to your external IP on port 443 (https)
Portforward 443 traffic on your router to the port specified in the code
If you are using WSL you will need to forward the traffic from windows to the WSL instance

## Site Layout
- /      <--(Landing page)
- /login
- /register
- /dashboard
    - /settings
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