# Assisted Prison Visits Scheme (APVS) - External Web

[![Build Status](https://travis-ci.org/ministryofjustice/apvs-external-web.svg?branch=develop)](https://travis-ci.org/ministryofjustice/apvs-external-web?branch=develop) [![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Beta implementation of the Assisted Prison Visits Scheme external web application.

## Requirements

* Docker (Including Docker Compose)
* Node 6 (Including NPM) - If running locally

## Run

### Locally
Install dependencies and run on port 3000.

```
npm install
./build.sh
npm start
```

### With Docker Compose
This will run the External Web application in development mode.

```
docker-compose build
docker-compose up
```

### With Docker

```
# Compile static resources and container image
npm install
./build.sh
docker build -t apvs-external-web-node:prod .
```

##### Run Production version:
```
docker run --rm
    -p 3000:3000
    --name apvs-external-web-node-prod apvs-external-web-node:prod
```

##### Run development version:
```
docker run --rm -t -i
    -p 3000:3000
    -v $(pwd)/app:/usr/src/app/app
    -v $(pwd)/cache_node_modules:/usr/src/app/node_modules
    --name apvs-external-web-node-dev apvs-external-web-node:dev
```

## Test

Checks code against standard JS and runs mocha unit tests.
```
npm test
```

Run e2e local selenium test
```
# Requires application running on http://localhost:3000
./node_modules/.bin/gulp test
# sometimes selenium-standalone will not end correctly causing subsequent test runs to fail use:
# pkill -f selenium-standalone
```

## Notes

### Localisation

As a GOV.UK service this application should support Welsh.

Localisation is provided via the [i18n node module](https://www.npmjs.com/package/i18n) which populates localisation strings for the supported locales into `app/locales`. Near the end of the Beta the localisation files will be sent for translation and populated.