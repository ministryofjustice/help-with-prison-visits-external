const mockViewEngine = require('../../unit/routes/mock-view-engine')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const VIEWS_DIRECTORY = '../../../app/views'

module.exports.VALID_REFERENCE = 'A123456'
module.exports.VALID_CLAIM_ID = '1'

module.exports.build = function (route) {
  app.use(bodyParser.json())
  route(app)
  mockViewEngine(app, VIEWS_DIRECTORY)
  return app
}
