FROM node:16-slim

ARG BUILD_ENV=github

RUN apk update && apk add openssl

WORKDIR /app

COPY . . 

RUN yarn

ENV NODE_ENV="production"

RUN yarn build

WORKDIR /app

CMD ["yarn", "run", "start"]