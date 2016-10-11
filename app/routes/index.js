var express = require('express')
var log = require('../services/log')

module.exports = function (app) {
  var route = express.Router()

  route.use(function (req, res, next) {
    log.info({ request: req }, 'Route Started.')
    next()
  })

  app.use('/', route)

  route.get('/', function (req, res, next) {
    res.render('index', { title: 'APVS index' })
    next()
  })

  route.use(function (req, res) {
    log.info({ response: res }, 'Route Complete.')
  })
}
