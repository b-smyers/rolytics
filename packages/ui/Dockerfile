FROM node:latest AS pnpm-stage
RUN npm install -g pnpm

FROM pnpm-stage AS build-stage
WORKDIR /ui-app

EXPOSE 3000

CMD ["pnpm", "start"]

COPY ./package.json ./packages/ui/package.json
COPY ../../pnpm-lock.yaml ./

RUN pnpm install --filter=ui

COPY . .