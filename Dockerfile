# NOTE THIS IS NOT A PRODUCTION READY CONTAINER FOR DEVELOPMENT ONLY
FROM node:6.5.0

RUN mkdir -p /usr/src/app/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY config.js /usr/src/app/
COPY knexfile.js /usr/src/app/
COPY app /usr/src/app/app
COPY migrations /usr/src/app/migrations

EXPOSE 3000

HEALTHCHECK CMD curl --fail http://localhost:3000/status || exit 1

# Resolve dependencies at container startup to allow caching
CMD npm install && npm run-script migrations && node_modules/.bin/nodemon --exec node_modules/.bin/gulp --config="nodemon.json"