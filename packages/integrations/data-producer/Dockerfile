FROM node:16-alpine as  build

WORKDIR /runner

RUN apk update && apk add python3 build-base

COPY . .

RUN yarn install --immutable

WORKDIR /runner/packages/integrations/data-producer

RUN yarn build

RUN cp -Lr /runner/packages/integrations/data-producer/node_modules /runner/_node_modules/

FROM node:16-alpine

WORKDIR /app

COPY --from=build /runner/_node_modules /app/node_modules
COPY --from=build /runner/packages/integrations/data-producer/package.json /app/package.json
COPY --from=build /runner/packages/integrations/data-producer/dist/* /app/

CMD [ "node", "--tls-min-v1.0", "index.js"]