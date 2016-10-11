/**
 * This file defines all routes used in this application. Any logic that is applicable to all routes can be added here.
 */

var routes = [
  require('./index'),
  require('./health-check/status')
]

module.exports = function (router) {
  var log = require('../services/log')

  router.use(function (req, res, next) {
    log.info({ request: req }, 'Route Started.')
    next()
  })

  routes.forEach(function (route) {
    route(router)
  })

  router.use(function (req, res) {
    log.info({ response: res }, 'Route Complete.')
  })
}
