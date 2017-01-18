const mockViewEngine = require('../../unit/routes/mock-view-engine')
const express = require('express')
const bodyParser = require('body-parser')
const expressSanitized = require('express-sanitized')
const cookieParser = require('cookie-parser')

const VIEWS_DIRECTORY = '../../../app/views'

module.exports.buildApp = function (route) {
  var app = express()
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(expressSanitized())
  app.use(cookieParser())

  route(app)
  mockViewEngine(app, VIEWS_DIRECTORY)

  app.use(function (req, res, next) {
    next(new Error())
  })

  app.use(function (err, req, res, next) {
    if (err) {
      res.status(500).render('includes/error')
    }
  })
  return app
}
