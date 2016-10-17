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

### Heroku

The application can be deployed to [heroku](https://www.heroku.com/) for quick preview.

Deployment to heroku is automatically performed by [Travis using an encrypted deployment key](https://docs.travis-ci.com/user/deployment/heroku/) in `.travis.yml`.

```
heroku login
heroku create
heroku buildpacks:set heroku/nodejs

# Set config vars for application
# heroku config:set DB_USERNAME=mydbuser

git push heroku master
```

## Test

Checks code against standard JS and runs mocha unit tests.
```
npm test
```

Run e2e tests with local selenium standalone
```
# Requires application running on http://localhost:3000
npm run-script e2e
```

Run e2e tests with [saucelabs](https://saucelabs.com)
```
# set environmental variables for saucelabs
export SAUCE_USERNAME='MY_USERNAME'
export SAUCE_ACCESS_KEY='MY_KEY'
export SAUCE_BASEURL='http://localhost:3000' # proxy url for sauce connect

npm run-script e2e-ie8
npm run-script e2e-firefox
```

## Notes

### Localisation

As a GOV.UK service this application should support Welsh.

Localisation is provided via the [i18n node module](https://www.npmjs.com/package/i18n) which populates localisation strings for the supported locales into `app/locales`. Near the end of the Beta the localisation files will be sent for translation and populated.