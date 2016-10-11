var express = require('express')
var nunjucks = require('express-nunjucks')
var path = require('path')
var favicon = require('serve-favicon')
var bodyParser = require('body-parser')
var helmet = require('helmet')
var compression = require('compression')
var i18n = require('i18n')
var routes = require('./routes/routes')

var app = express()

// Use gzip compression - remove if possible via reverse proxy/Azure gateway.
app.use(compression())

// Set security headers.
app.use(helmet())

var packageJson = require('../package.json')
var developmentMode = app.get('env') === 'development'
var releaseVersion = packageJson.version
var serviceName = 'Assisted Prison Visit Service'

app.set('view engine', 'html')
app.set('views', path.join(__dirname, 'views'))

nunjucks(app, {
  watch: developmentMode,
  noCache: developmentMode
})

app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/public', express.static(path.join(__dirname, 'govuk_modules', 'govuk_template')))
app.use('/public', express.static(path.join(__dirname, 'govuk_modules', 'govuk_frontend_toolkit')))
app.use(favicon(path.join(__dirname, 'govuk_modules', 'govuk_template', 'images', 'favicon.ico')))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Send assetPath to all views.
app.use(function (req, res, next) {
  res.locals.asset_path = '/public/'
  next()
})

// Add variables that are available in all views.
app.use(function (req, res, next) {
  res.locals.serviceName = serviceName
  res.locals.releaseVersion = 'v' + releaseVersion
  next()
})

// Set locale for translations.
i18n.configure({
  locales: ['en', 'cy'],
  directory: path.join(__dirname, '/locales'),
  updateFiles: process.env.I18N_UPDATEFILES || true
})
app.use(i18n.init)

// Build the router to be used for routing all HTTP request and pass to the routes file for route configuration.
var router = express.Router()
routes(router)
app.use('/', router)

// catch 404 and forward to error handler.
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// Error handlers.
if (developmentMode) {
  app.use(function (err, req, res) {
    res.status(err.status || 500)
    res.render('includes/error', {
      message: err.message,
      error: err
    })
  })
}

// Production error handler - no stack traces leaked to user.
app.use(function (err, req, res) {
  res.status(err.status || 500)
  res.render('includes/error', {
    message: err.message,
    error: {}
  })
})

module.exports = app
