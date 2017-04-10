const mockViewEngine = require('../../unit/routes/mock-view-engine')
const express = require('express')
const bodyParser = require('body-parser')
const expressSanitized = require('express-sanitized')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')

const VIEWS_DIRECTORY = '../../../app/views'

module.exports.buildApp = function (route) {
  var app = express()
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(expressSanitized())
  app.use(cookieParser())

  app.use(cookieSession({
    name: 'apvs-start-already-registered',
    keys: ['test-secret'],
    expires: new Date(2050, 1),
    signed: false
  }))

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
