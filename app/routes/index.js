var express = require('express')

module.exports = function (app) {
  var route = express.Router()

  app.use('/', route)

  route.get('/', function (req, res) {
    res.render('index', { title: 'APVS index' })
  })
}
