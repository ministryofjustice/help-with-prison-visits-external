const mockViewEngine = require('../../unit/routes/mock-view-engine')
const express = require('express')
const htmlSanitizerMiddleware = require('../../../app/middleware/htmlSanitizer')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')

const VIEWS_DIRECTORY = '../../../app/views'

module.exports.buildApp = function (route) {
  const app = express()
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(htmlSanitizerMiddleware())
  app.use(cookieParser())

  app.use(cookieSession({
    name: 'apvs-start-application',
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
      console.log(err)
      res.status(500).render('includes/error')
    }
  })
  return app
}
