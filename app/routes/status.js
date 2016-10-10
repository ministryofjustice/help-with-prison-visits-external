var express = require('express')

module.exports = function (app) {
  var route = express.Router()

  app.use('/', route)

  route.get('/status', function (req, res) {
    res.render('status', { title: 'STATUS', status: 'OK' })
  })
}
