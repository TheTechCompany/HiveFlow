FROM node:16-slim

ARG BUILD_ENV=github

RUN apt-get update && apt-get install -y openssl

WORKDIR /app

COPY . . 

RUN yarn

ENV NODE_ENV="production"

RUN yarn build

WORKDIR /app

CMD ["yarn", "run", "start"]