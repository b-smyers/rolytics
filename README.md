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
```txt
PORT=<port>
NODE_ENV=<development or production>
JWT_ACCESS_SECRET=<insert access secret>
JWT_REFRESH_SECRET=<insert refresh secret>
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

## API Layout
- /api/v1
    - /auth
        - /login
        - /register
        - /logout
        - /refresh
        - /verify
    - /users/<ID>
        - /profile
        - /settings
        - /experiences/<ID>
            - /analytics
                - /gameplay
                - /engagement
                - /retention
            - /performance
                - /fps
                - /latency
                - /uptime
                - /load
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
            - /servers/<ID>
                - /analytics
                    - /gameplay
                    - /engagement
                    - /retention
                - /performance
                    - /fps
                    - /latency
                    - /uptime
                    - /load
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