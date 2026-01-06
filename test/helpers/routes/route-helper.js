const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const htmlSanitizerMiddleware = require('../../../app/middleware/htmlSanitizer')
const mockViewEngine = require('../../unit/routes/mock-view-engine')

const VIEWS_DIRECTORY = '../../../app/views'

module.exports.buildApp = route => {
  const app = express()
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(htmlSanitizerMiddleware())
  app.use(cookieParser())

  app.use((req, res, next) => {
    session({
      secret: 'test-secret',
      resave: false,
      saveUninitialized: false,
      rolling: true,
      proxy: false,
      name: 'apvs-start-application',
      cookie: {
        expires: new Date(2050, 1),
        sameSite: 'lax',
        secure: false,
        signed: false,
      },
    })
  })

  route(app)
  mockViewEngine(app, VIEWS_DIRECTORY)

  app.use((req, res, next) => {
    next(new Error())
  })

  app.use((err, req, res, next) => {
    if (err) {
      res.status(500).render('includes/error')
    }
  })
  return app
}
