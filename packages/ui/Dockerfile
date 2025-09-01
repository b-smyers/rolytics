ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-alpine AS base

RUN npm install -g pnpm@9.12.0
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/ui/package.json ./packages/ui/package.json
RUN pnpm install --frozen-lockfile

# Build UI
FROM deps AS ui-builder
WORKDIR /app
COPY packages/ui ./packages/ui
RUN cd packages/ui && pnpm run build

# UI Production Image
FROM base AS ui
WORKDIR /app
COPY pnpm-workspace.yaml package.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=ui-builder /app/packages/ui ./packages/ui
CMD ["pnpm", "--filter", "ui", "start"]
