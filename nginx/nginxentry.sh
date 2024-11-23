#!/bin/bash

# Check if certificates exist
if [ ! -f /etc/letsencrypt/live/rolytics.bot.nu/fullchain.pem ]; then
    echo "Generating certificates..."
    certbot certonly --nginx -d rolytics.bot.nu --agree-tos -m admin@rolytics.bot.nu --non-interactive
fi

# Renew certificates in the background
certbot renew --quiet --no-random-sleep-on-renew --post-hook "nginx -s reload" &

# Start Nginx
nginx -g "daemon off;"
