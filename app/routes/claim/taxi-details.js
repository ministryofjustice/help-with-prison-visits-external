module.exports = function (router) {
  router.get('/taxi-details', function (req, res, next) {
    res.render('claim/taxi-details')
    next()
  })

  router.post('/taxi-details', function (req, res, next) {
    res.redirect('additional-expenses')
    next()
  })
}
