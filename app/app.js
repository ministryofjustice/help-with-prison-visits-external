const express = require('express')
const crypto = require('crypto')
const { randomUUID } = require('crypto')
const path = require('path')
const helmet = require('helmet')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const i18n = require('i18n')
const { doubleCsrf } = require('csrf-csrf')
const cookieSession = require('cookie-session')
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
app.set('trust proxy', 1) // trust first proxy
app.use(
  cookieSession({
    name: 'apvs-start-application',
    secret: config.EXT_APPLICATION_SECRET,
    maxAge: parseInt(config.EXT_SESSION_COOKIE_MAXAGE, 10),
  }),
)

// Update a value in the cookie so that the set-cookie will be sent
app.use((req, res, next) => {
  req.session.nowInMinutes = Date.now() / 60e3
  next()
})

// Generate unique ID for request for use in session
app.use((req, res, next) => {
  log.info('================================>')
  log.info(`session  ${JSON.stringify(req.session)}`)
  log.info(req.originalUrl)
  const oldCsrfId = req.session.csrfId
  log.info(`old session csrfId: ${oldCsrfId}`)
  const csrfId = oldCsrfId === undefined ? randomUUID() : oldCsrfId
  req.session.csrfId = csrfId
  log.info(`set session csrfId: ${req.session.csrfId}`)

  log.info(`session  ${JSON.stringify(req.session)}`)
  log.info('================================<')
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
app.use(cookieParser())

// Check for valid CSRF tokens on state-changing methods.
const {
  doubleCsrfProtection, // This is the default CSRF protection middleware.
} = doubleCsrf({
  getSecret: () => config.EXT_APPLICATION_SECRET,
  getSessionIdentifier: req => req.session.csrfId,
  getCsrfTokenFromRequest: req => {
    // eslint-disable-next-line no-underscore-dangle
    log.info(`_csrf:${req.body?._csrf}`)
    log.info(req.cookies['apvs-csrf'])
    log.info(`secure: ${config.EXT_SECURE_COOKIE}`)
    log.info(`session:${req.session.csrfId}`)
    // eslint-disable-next-line no-underscore-dangle
    return req.body?._csrf
  },
  cookieName: 'apvs-csrf',
  cookieOptions: { secure: config.EXT_SECURE_COOKIE === 'true' },
})

app.use((req, res, next) => {
  if (req.originalUrl.includes('file-upload') && req.method === 'POST') {
    next()
  }

  doubleCsrfProtection(req, res, next)
})

// Generate CSRF tokens to be sent in POST requests
app.use((req, res, next) => {
  if (typeof req.csrfToken === 'function') {
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
  log.error(err.message)
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
  res.status(err.status || 500)
  if (err.status === 404) {
    return res.render('includes/error-404')
  }

  log.error(err)
  return res.render('includes/error', {
    error: developmentMode ? err : null,
  })
})

module.exports = app
