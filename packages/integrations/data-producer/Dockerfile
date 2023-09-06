FROM node:16-alpine as  build

WORKDIR /runner

COPY . .

RUN yarn

RUN yarn build

RUN cp -Lr /runner/node_modules /runner/_node_modules/

FROM node:16-alpine

WORKDIR /app

COPY --from=build /runner/_node_modules /app/node_modules
COPY --from=build /runner/package.json /app/package.json
COPY --from=build /runner/dist/* /app/

CMD [ "node", "index.js", "--tls-min-v1.0" ]