const mockViewEngine = require('../../unit/routes/mock-view-engine')
const express = require('express')
const bodyParser = require('body-parser')

const VIEWS_DIRECTORY = '../../../app/views'

module.exports.buildApp = function (route) {
  var app = express()
  app.use(bodyParser.urlencoded({
    extended: false
  }))

  route(app)
  mockViewEngine(app, VIEWS_DIRECTORY)

  app.use(function (err, req, res, next) {
    if (err) {
      res.status(500).render('includes/error')
    }
  })
  return app
}
