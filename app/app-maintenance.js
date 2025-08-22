const express = require('express')
const nunjucks = require('nunjucks')
const path = require('path')
const i18n = require('i18n')
const log = require('./services/log')

const app = express()
const serviceName = 'Get help with the cost of prison visits'

const developmentMode = app.get('env') === 'development'

const appViews = [path.join(__dirname, '../node_modules/govuk-frontend/'), path.join(__dirname, 'views')]

// View Engine Configuration
app.set('view engine', 'html')
nunjucks.configure(appViews, {
  express: app,
  autoescape: true,
  watch: false,
  noCache: false,
})

const publicFolders = ['public', 'assets']

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

// Send assetPath to all views.
app.use((req, res, next) => {
  res.locals.asset_path = '/public/'
  next()
})

// Set locale for translations.
i18n.configure({
  locales: ['en', 'cy'],
  directory: path.join(__dirname, '/locales'),
  updateFiles: false,
})
app.use(i18n.init)

// Add variables that are available in all views.
app.use((req, res, next) => {
  res.locals.serviceName = serviceName
  next()
})

// Display maintenance page
app.use((req, res, next) => {
  res.render('includes/maintenance')
})

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
  const err = new Error('Not Found')
  err.status = 404
  res.status(404)
  next(err)
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
