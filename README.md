# Assisted Prison Visits Scheme (APVS) - External Web

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Implementation of the Assisted Prison Visits Scheme external web application.

## Requirements

* docker
* Node 6 (including npm)

## Run

### Run local

```
npm install # install dependencies
./build.sh  # build static resources from dependencies
npm start   # http://localhost:3100
```

### Run development container

```
# Compile static resources and container image
npm install
./build.sh
docker build -f Dockerfile-dev -t apvs-external-web-node:dev .

# Run with nodemon and host volumes for app folder mapped to container to reload on changes and cached node_modules
docker run --rm -t -i -p 3100:3100 -v $(pwd)/app:/usr/src/app/app -v $(pwd)/cache_node_modules:/usr/src/app/node_modules --name apvs-external-web-node-dev apvs-external-web-node:dev
```

### Run production container

```
# Compile static resources and container image
npm install
./build.sh
docker build -t apvs-external-web-node:prod .

# Run with PM2 process manager to run clustered process per CPU and restart on any failures
docker run --rm -p 3100:3100 --name apvs-external-web-node-prod apvs-external-web-node:prod
```

## Test
`npm test # checks code against standard JS and runs mocha tests`
