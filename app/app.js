const config = require('../config')
const express = require('express')
const nunjucks = require('express-nunjucks')
const path = require('path')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const expressSanitized = require('express-sanitized')
const helmet = require('helmet')
const compression = require('compression')
const i18n = require('i18n')
const routes = require('./routes/routes')
const log = require('./services/log')
const onFinished = require('on-finished')
const cookieParser = require('cookie-parser')
const csurf = require('csurf')
const csrfExcludeRoutes = require('./constants/csrf-exclude-routes')
const auth = require('basic-auth')

var app = express()

// Use gzip compression - remove if possible via reverse proxy/Azure gateway.
app.use(compression())

// Set security headers.
app.use(helmet())
app.use(helmet.hsts({ maxAge: 5184000 }))

// Configure Content Security Policy
// Hashes for inline Gov Template script entries
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'",
      'www.google-analytics.com',
      "'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU='",
      "'sha256-G29/qSW/JHHANtFhlrZVDZW1HOkCDRc78ggbqwwIJ2g='"],
    styleSrc: ["'self'"],
    fontSrc: ['data:'],
    imgSrc: ["'self'", 'www.google-analytics.com']
  }
}))

var packageJson = require('../package.json')
var developmentMode = app.get('env') === 'development'
var releaseVersion = packageJson.version
var serviceName = 'Get help with prison visits'

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

// Basic auth
if (config.BASIC_AUTH_ENABLED === 'true') {
  app.use(function (req, res, next) {
    var credentials = auth(req)

    if (req.url === '' || req.url === '/' || req.url === '/status') {
      next() // must leave root url free for Azure gateway
    } else {
      if (!credentials ||
        credentials.name !== config.BASIC_AUTH_USERNAME ||
        credentials.pass !== config.BASIC_AUTH_PASSWORD) {
        res.statusCode = 401
        res.setHeader('WWW-Authenticate', 'Basic realm="APVS External Web"')
        res.end('Access denied')
      } else {
        next()
      }
    }
  })
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressSanitized())

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
  updateFiles: config.I18N_UPDATEFILES || true
})
app.use(i18n.init)

// Log each HTML request and it's response.
app.use(function (req, res, next) {
  // Log response started.
  log.info({ request: req }, 'Route Started.')

  // Log response finished.
  onFinished(res, function () {
    log.info({ response: res }, 'Route Complete.')
  })
  next()
})

// Use cookie parser middleware (required for csurf)
app.use(cookieParser(config.EXT_APPLICATION_SECRET, { httpOnly: true, secure: config.EXT_SECURE_COOKIE === 'true' }))

// Check for valid CSRF tokens on state-changing methods.
var csrfProtection = csurf({ cookie: { httpOnly: true, secure: config.EXT_SECURE_COOKIE === 'true' } })

app.use(function (req, res, next) {
  csrfExcludeRoutes.forEach(function (route) {
    if (req.originalUrl.includes(route) && req.method === 'POST') {
      next()
    } else {
      csrfProtection(req, res, next)
    }
  })
})

// Generate CSRF tokens to be sent in POST requests
app.use(function (req, res, next) {
  if (req.hasOwnProperty('csrfToken')) {
    res.locals.csrfToken = req.csrfToken()
  }
  next()
})

// Build the router to route all HTTP requests and pass to the routes file for route configuration.
var router = express.Router()
routes(router)
app.use('/', router)

// catch 404 and forward to error handler.
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  res.status(404)
  next(err)
})

// catch CSRF token errors
app.use(function (err, req, res, next) {
  log.error({error: err})
  if (err.code !== 'EBADCSRFTOKEN') return next(err)
  res.status(403)
  res.render('includes/error', {
    error: 'Invalid CSRF token'
  })
})

// Development error handler.
app.use(function (err, req, res, next) {
  log.error({error: err})
  res.status(err.status || 500)
  if (err.status === 404) {
    res.render('includes/error-404')
  } else {
    res.render('includes/error', {
      error: developmentMode ? err : {}
    })
  }
})

module.exports = app
