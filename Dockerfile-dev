FROM node:6.5.0

RUN mkdir -p /usr/src/app/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY app /usr/src/app/app

EXPOSE 3000

HEALTHCHECK CMD curl --fail http://localhost:3000/status || exit 1

# Resolve dependencies at container startup to allow caching
CMD npm install && node_modules/.bin/nodemon ./bin/www