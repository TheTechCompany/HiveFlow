FROM node:16-alpine

WORKDIR /runner

COPY . .

RUN yarn

WORKDIR /runner

CMD [ "yarn", "start" ]