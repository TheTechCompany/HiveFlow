FROM node:16-alpine

WORKDIR /runner

COPY . .

RUN yarn
RUN npx lerna bootstrap --scope @hexhive/data-producer --include-dependencies

WORKDIR /runner/packages/integrations/data-producer

CMD [ "yarn", "start" ]