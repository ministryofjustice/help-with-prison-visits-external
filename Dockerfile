FROM node:14-buster as builder

ARG BUILD_NUMBER
ARG GIT_REF

RUN apt-get update && \
    apt-get upgrade -y

WORKDIR /app

COPY . .

RUN npm ci --no-audit && \
    npm run generate-assets

HEALTHCHECK CMD curl --fail http://localhost:3000/status || exit 1

CMD [ "node", "./app/bin/www" ]
# CMD npm install && npm run-script migrations && node_modules/.bin/nodemon --exec node_modules/.bin/gulp --config="nodemon.json"
