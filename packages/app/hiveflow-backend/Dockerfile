FROM node:22

ARG BUILD_ENV=github

RUN apt-get update && apt-get install -y openssl

WORKDIR /app

COPY . . 

RUN yarn

WORKDIR /app/packages/app/hiveflow-backend

RUN npx prisma generate

RUN yarn build


# WORKDIR /app

ENV NODE_ENV="production"

CMD ["yarn", "run", "start"]