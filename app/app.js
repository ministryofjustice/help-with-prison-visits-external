const express = require('express')
const crypto = require('crypto')
const path = require('path')
const helmet = require('helmet')
const compression = require('compression')
const i18n = require('i18n')
const cookieParser = require('cookie-parser')
const csurf = require('csurf')
const csrfExcludeRoutes = require('./constants/csrf-exclude-routes')
const session = require('express-session')
const log = require('./services/log')
const routes = require('./routes/routes')
const htmlSanitizerMiddleware = require('./middleware/htmlSanitizer')
const nunjucksSetup = require('./services/nunjucks-setup')
const config = require('../config')

const app = express()

// Use gzip compression - remove if possible via reverse proxy/Azure gateway.
app.use(compression())

// Set security headers.
app.use(helmet())
app.use(helmet.hsts({ maxAge: 5184000 }))

// Configure Content Security Policy
// Hashes for inline Gov Template script entries
app.use((_req, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString('hex')
  next()
})
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        '*.google-analytics.com',
        'www.googletagmanager.com',
        (_req, res) => `'nonce-${res.locals.cspNonce}'`,
      ],
      connectSrc: ["'self'", '*.google-analytics.com'],
      styleSrc: ["'self'"],
      fontSrc: ["'self'", 'data:'],
      imgSrc: ["'self'", '*.google-analytics.com'],
    },
  }),
)

const packageJson = require('../package.json')

const developmentMode = app.get('env') === 'development'
const releaseVersion = packageJson.version
const serviceName = 'Get help with the cost of prison visits'

nunjucksSetup(app, developmentMode)

const publicFolders = [
  'public',
  'assets',
  '../node_modules/govuk_template_jinja/assets',
  '../node_modules/govuk_frontend_toolkit',
]

publicFolders.forEach(dir => {
  app.use('/public', express.static(path.join(__dirname, dir)))
})

// new govuk-frontend asset paths
const govukAssets = [
  '../node_modules/govuk-frontend/dist/govuk/assets',
  '../node_modules/govuk-frontend/dist',
  '../node_modules/jquery/dist',
  '../node_modules/jquery-ui-dist',
]
govukAssets.forEach(dir => {
  app.use('/assets', express.static(path.join(__dirname, dir)))
})

// Cookie session
app.set('trust proxy', true) // trust first proxy
app.use(
  session({
    secret: config.EXT_APPLICATION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    proxy: true,
    name: 'apvs-start-application',
    cookie: {
      httpOnly: true,
      maxAge: parseInt(config.EXT_SESSION_COOKIE_MAXAGE, 10),
      sameSite: 'lax',
      secure: config.production,
      signed: true,
    },
  }),
)
// Update a value in the cookie so that the set-cookie will be sent
app.use((req, res, next) => {
  req.session.nowInMinutes = Date.now() / 60e3
  next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(htmlSanitizerMiddleware())

// Send assetPath to all views.
app.use((req, res, next) => {
  res.locals.asset_path = '/public/'
  req.body = req.body || {}
  next()
})

// Add variables that are available in all views.
app.use((req, res, next) => {
  res.locals.serviceName = serviceName
  res.locals.releaseVersion = `v${releaseVersion}`
  next()
})

// Set locale for translations.
i18n.configure({
  locales: ['en', 'cy'],
  directory: path.join(__dirname, '/locales'),
  updateFiles: config.I18N_UPDATEFILES || true,
})
app.use(i18n.init)

// Use cookie parser middleware (required for csurf)
app.use(cookieParser(config.EXT_APPLICATION_SECRET, { httpOnly: true, secure: config.EXT_SECURE_COOKIE === 'true' }))

// Check for valid CSRF tokens on state-changing methods.
const csrfProtection = csurf({ cookie: { httpOnly: true, secure: config.EXT_SECURE_COOKIE === 'true' } })

app.use((req, res, next) => {
  csrfExcludeRoutes.forEach(route => {
    if (req.originalUrl.includes(route) && req.method === 'POST') {
      next()
    } else {
      csrfProtection(req, res, next)
    }
  })
})

// Generate CSRF tokens to be sent in POST requests
app.use((req, res, next) => {
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
app.use((req, res, next) => {
  if (req.url === '/robots.txt') {
    res.type('text/plain')
    res.send('User-agent: *\nDisallow: /')
  } else {
    next()
  }
})

// catch 404 and forward to error handler.
app.use((req, res, next) => {
  const err = new Error(`Not Found: ${req.originalUrl}`)
  err.status = 404
  res.status(404)
  next(err)
})

// catch CSRF token errors
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)
  log.error(err)
  res.status(403)
  return res.render('includes/error', {
    error: 'Invalid CSRF token',
  })
})

// Development error handler.
app.use((err, req, res, next) => {
  log.error(err)
  res.status(err.status || 500)
  if (err.status === 404) {
    res.render('includes/error-404')
  } else {
    res.render('includes/error', {
      error: developmentMode ? err : null,
    })
  }
})

module.exports = app
