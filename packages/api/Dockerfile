FROM node:latest AS pnpm-stage
RUN npm install -g pnpm

FROM pnpm-stage AS build-stage
WORKDIR /api-app

EXPOSE 5000

CMD ["pnpm", "start"]

COPY ./package.json ./packages/api/package.json
COPY ../../pnpm-lock.yaml ./

RUN pnpm install --filter=api

COPY . .