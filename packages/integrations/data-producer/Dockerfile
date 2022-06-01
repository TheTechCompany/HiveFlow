FROM node:16-alpine

WORKDIR /runner

COPY . .

RUN yarn

WORKDIR /runner/packages/integrations/data-producer

CMD [ "yarn", "start" ]