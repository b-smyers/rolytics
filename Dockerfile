FROM node:20-alpine AS base
RUN npm install -g pnpm
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