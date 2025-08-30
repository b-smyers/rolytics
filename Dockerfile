ARG NODE_VERSION
FROM node:${NODE_VERSION}-alpine AS base

RUN npm install -g pnpm@9.12.0
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/ui/package.json ./packages/ui/package.json
COPY packages/api/package.json ./packages/api/package.json
RUN pnpm install --frozen-lockfile

# Build UI
FROM deps AS ui-builder
WORKDIR /app
COPY packages/ui ./packages/ui
RUN cd packages/ui && pnpm run build

# Build API
FROM deps AS api-builder
WORKDIR /app
COPY packages/api ./packages/api
RUN mkdir -p /app/packages/api/logs
RUN cd packages/api && pnpm run build

# API Production Image
FROM base AS api
WORKDIR /app
COPY pnpm-workspace.yaml package.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=api-builder /app/packages/api ./packages/api
CMD ["pnpm", "--filter", "api", "start"]

# UI Production Image
FROM base AS ui
WORKDIR /app
COPY pnpm-workspace.yaml package.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=ui-builder /app/packages/ui ./packages/ui
CMD ["pnpm", "--filter", "ui", "start"]

# Proxy
FROM nginx:latest AS proxy

# Install Certbot and its dependencies
RUN apt-get update && apt-get install -y \
    certbot \
    python3-certbot-nginx \
    && rm -rf /var/lib/apt/lists/*

# Expose HTTP and HTTPS ports
EXPOSE 80 443

RUN mkdir -p /etc/letsencrypt/live

# Copy Nginx configuration
COPY packages/proxy/configs/rolytics.conf /etc/nginx/conf.d/default.conf

# Copy error pages
COPY packages/proxy/html /var/www/html

# Add entrypoint script for Certbot initial setup and renewal
CMD [ "sh",  "-c",  "certbot certonly --nginx -d rolytics.bot.nu --agree-tos -m bs602422@ohio.edu --non-interactive && certbot renew && nginx -g 'daemon off;'" ]
