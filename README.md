# Assisted Prison Visits Scheme (APVS) - External Web

[![Build Status](https://travis-ci.org/ministryofjustice/apvs-external-web.svg?branch=develop)](https://travis-ci.org/ministryofjustice/apvs-external-web?branch=develop) [![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/) [![NSP Status](https://nodesecurity.io/orgs/ministry-of-justice-digital/projects/ab82f6bb-11e0-4368-b7b8-abe97fb65d8a/badge)](https://nodesecurity.io/orgs/ministry-of-justice-digital/projects/ab82f6bb-11e0-4368-b7b8-abe97fb65d8a)

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

### Heroku

The application can be deployed to [heroku](https://www.heroku.com/) for quick preview.

```
heroku login
heroku create
heroku buildpacks:set heroku/nodejs

# Set config vars for application
# heroku config:set DB_USERNAME=mydbuser

git push heroku master
```

## Test

```
npm test                        # checks code against standard JS and runs mocha unit tests.
npm run-script test-coverage    # unit tests and generates code coverage using Istanbul
npm run-script test-unit        # unit tests
npm run-script test-integration # integration tests
npm run-script test-e2e         # e2e tests using selenium standalone against local application (must already be running)
npm run-script test-e2e-smoke   # short smoke test using selenium standalone against local application (must already be running)
npm run-script test-load        # Runs e2e load test script using [Artillery](https://artillery.io/)
```

Run e2e tests with [saucelabs](https://saucelabs.com)
```
# set environmental variables for saucelabs
export SAUCE_USERNAME='MY_USERNAME'
export SAUCE_ACCESS_KEY='MY_KEY'
export SAUCE_BASEURL='http://localhost:3000' # proxy url for sauce connect

npm run-script test-e2e-ie8
npm run-script test-e2e-firefox
npm run-script test-e2e-ios
npm run-script test-e2e-android

```

Run accessibility tests with [pa11y](https://github.com/pa11y/pa11y)
```
npm install -g pa11y
# requires existing claim data in local running environment so screens load correctly
# will generate a number of HTML reports with WCAG2AAA accessibility issues for pages
# usage: ./run-pa11y encryptedReferenceId claimId encryptedReference submittedDob submittedEncryptedReference submittedClaimId
./run-pa11y.sh 3d431e08aea55ea70faa 17 49411309bdb15b 1975-11-22 4e410d0bcda059 16
```

## Database

The application requires a MS SQL database instance, configured with an external web user and a migration user. See [here](https://github.com/ministryofjustice/apvs/tree/develop/database) for details.

The Internal Web has a series of knex seed files that define table functions that can be called from the External Web to retrieve previously submitted claims.

To run the [knex](http://knexjs.org/) database migrations and seeds:

```
npm run-script migrations
```

To rollback the last batch of changes:
```
npm run-script rollback
```

## Security

### CSRF
We are using [csurf](https://github.com/expressjs/csurf) for CSRF protection. All `POST` requests must have a valid CSRF token, which is added as a hidden input on HTML forms.

Use the following partial to add the hidden input:

```
{% include "partials/csrf-hidden-input.html" %}
```

### Reference/Reference ID encryption
In all instances where the Reference or Reference ID is used in the URL, it will be encrypted using AES encryption via the standard Node Crypto package.

Functions for encrypting/decrypting these values have been implemented in app/services/helpers directory.

### Clam AV

The file upload component uses Clam AV to scan uploaded files for malware.

To test locally this requires the installation of the Clam AV binary.

[Instructions for installation on Mac OSX](https://gist.github.com/zhurui1008/4fdc875e557014c3a34e)

Note that you will need to have the clamd daemon running, which will live in sbin by default:

`/usr/local/sbin/clamd &`

## Notes

### Localisation

As a GOV.UK service this application should support Welsh.

Localisation is provided via the [i18n node module](https://www.npmjs.com/package/i18n) which populates localisation strings for the supported locales into `app/locales`. Near the end of the Beta the localisation files will be sent for translation and populated.

### Updating dependencies

This node application uses [npm shrinkwrap](https://docs.npmjs.com/cli/shrinkwrap) to fix dependencies and peer dependencies to specific versions. This prevents node modules from automatically updating on new releases without developers knowledge.

To manually update a dependency (e.g. GOV.UK styles) use `npm update my-dependency` and commit the updated `package.json` and `npm-shrinkwrap.json` files.

Please note, there is an outstanding [bug in npm](https://github.com/npm/npm/issues/14042) which attempts to install incompatible optional dependencies when referenced in shrinkwrap (`fsevents` is one). To prevent this, either update the dependency from inside a docker image or manually remove the dependency from `npm-shrinkwrap.json`.
