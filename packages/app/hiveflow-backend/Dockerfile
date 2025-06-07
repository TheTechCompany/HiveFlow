FROM node:24-slim

ARG BUILD_ENV=github

RUN apt-get update && apt-get install -y openssl

WORKDIR /app

COPY . . 

RUN yarn

WORKDIR /app/packages/app/hiveflow-backend

RUN yarn build

RUN npx prisma generate

# WORKDIR /app

ENV NODE_ENV="production"

CMD ["yarn", "run", "start"]