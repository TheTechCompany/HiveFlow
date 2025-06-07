FROM node:20-slim

ARG BUILD_ENV=github

RUN apt-get update && apt-get install -y openssl

WORKDIR /app

COPY . . 

RUN yarn

WORKDIR /app/packages/app/hiveflow-backend

RUN npx prisma generate

WORKDIR /app

ENV NODE_ENV="production"

RUN yarn build

WORKDIR /app

CMD ["yarn", "run", "start"]