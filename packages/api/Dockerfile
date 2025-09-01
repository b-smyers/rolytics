ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-alpine AS base

RUN npm install -g pnpm@9.12.0
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/api/package.json ./packages/api/package.json
RUN pnpm install --frozen-lockfile

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
