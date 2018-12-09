FROM node:11.4.0-alpine
MAINTAINER soulteary <soulteary@gmail.com>

RUN apk update && apk add yarn
WORKDIR /app
COPY .  /app
RUN yarn

ENTRYPOINT [ "node", "index.js" ]
