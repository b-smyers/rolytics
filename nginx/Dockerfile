FROM nginx:latest

# Install Certbot and its dependencies
RUN apt-get update && apt-get install -y \
    certbot \
    python3-certbot-nginx \
    && rm -rf /var/lib/apt/lists/*

# Expose HTTP and HTTPS ports
EXPOSE 80 443

RUN mkdir -p /etc/letsencrypt/live

# Copy Nginx configuration
COPY ./configs/rolytics.conf /etc/nginx/conf.d/default.conf

# Copy error pages
COPY ./html /var/www/html

# Add entrypoint script for initial Certbot setup and certificate renewal
CMD [ "sh",  "-c",  "certbot certonly --nginx -d rolytics.bot.nu --agree-tos -m bs602422@ohio.edu --non-interactive && certbot renew && nginx -g 'daemon off;'"]
