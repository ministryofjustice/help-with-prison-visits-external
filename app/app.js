require('./azure-appinsights')
const config = require('../config')
const express = require('express')
const nunjucks = require('nunjucks')
const path = require('path')
const favicon = require('serve-favicon')
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
const RateLimit = require('express-rate-limit')
const cookieSession = require('cookie-session')

const app = express()

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
      "'sha256-G29/qSW/JHHANtFhlrZVDZW1HOkCDRc78ggbqwwIJ2g='",
      "'sha256-l1eTVSK8DTnK8+yloud7wZUqFrI0atVo6VlC6PJvYaQ='"], // govuk-frontend - initAll() inline script
    connectSrc: ["'self'", 'www.google-analytics.com'],
    styleSrc: ["'self'"],
    fontSrc: ["'self'", 'data:'],
    imgSrc: ["'self'", 'www.google-analytics.com']
  }
}))

// rate limiting
if (config.RATE_LIMITING_ENABLED === 'true') {
  app.enable('trust proxy')
  const limiter = new RateLimit({
    windowMs: parseInt(config.RATE_LIMITING_WINDOW_MILLISECONDS),
    max: parseInt(config.RATE_LIMITING_REQUEST_LIMIT),
    delayMs: 0, // disable delaying - full speed until the max limit is reached
    skip: function (req) {
      return req.url.startsWith('/public') // skip public assets
    }
  })
  //  apply to all requests
  app.use(limiter)
}

const packageJson = require('../package.json')
const developmentMode = app.get('env') === 'development'
const releaseVersion = packageJson.version
const serviceName = 'Get help with the cost of prison visits'

const appViews = [
  path.join(__dirname, '../node_modules/govuk-frontend/'),
  path.join(__dirname, '../node_modules/govuk_template_jinja/'),
  path.join(__dirname, 'views')
]

// View Engine Configuration
app.set('view engine', 'html')
nunjucks.configure(appViews, {
  express: app,
  autoescape: true,
  watch: developmentMode,
  noCache: developmentMode
})

const publicFolders = ['public', 'assets', '../node_modules/govuk_template_jinja/assets', '../node_modules/govuk_frontend_toolkit']

publicFolders.forEach(dir => {
  app.use('/public', express.static(path.join(__dirname, dir)))
})

// new govuk-frontend asset paths
const govukAssets = [
  '../node_modules/govuk-frontend/govuk/assets',
  '../node_modules/govuk-frontend'
]
govukAssets.forEach(dir => {
  app.use('/assets', express.static(path.join(__dirname, dir)))
})

app.use(favicon(path.join(__dirname, '../node_modules/govuk_template_jinja/assets/images/favicon.ico')))

// Cookie session
app.set('trust proxy', 1) // trust first proxy
app.use(cookieSession({
  name: 'apvs-start-application',
  keys: [config.EXT_APPLICATION_SECRET],
  maxAge: parseInt(config.EXT_SESSION_COOKIE_MAXAGE)
}))
// Update a value in the cookie so that the set-cookie will be sent
app.use(function (req, res, next) {
  req.session.nowInMinutes = Date.now() / 60e3
  next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
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
const csrfProtection = csurf({ cookie: { httpOnly: true, secure: config.EXT_SECURE_COOKIE === 'true' } })

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
  if (Object.prototype.hasOwnProperty.call(req, 'csrfToken')) {
    res.locals.csrfToken = req.csrfToken()
  }
  next()
})

// Build the router to route all HTTP requests and pass to the routes file for route configuration.
const router = express.Router()
routes(router)
app.use('/', router)

// Use robots.txt and root level redirections
app.use(function (req, res, next) {
  if (req.url === '/robots.txt') {
    res.type('text/plain')
    res.send('User-agent: *\nDisallow: /')
  } else {
    next()
  }
})

// catch 404 and forward to error handler.
app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  res.status(404)
  next(err)
})

// catch CSRF token errors
app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)
  log.error({ error: err })
  res.status(403)
  res.render('includes/error', {
    error: 'Invalid CSRF token'
  })
})

// Development error handler.
app.use(function (err, req, res, next) {
  log.error({ error: err })
  res.status(err.status || 500)
  if (err.status === 404) {
    res.render('includes/error-404')
  } else {
    res.render('includes/error', {
      error: developmentMode ? err : null
    })
  }
})

module.exports = app
