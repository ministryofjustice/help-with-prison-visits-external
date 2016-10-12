module.exports = function (router) {
  router.get('/start', function (req, res, next) {
    res.render('start')
    next()
  })

  router.post('/first-time', function (req, res, next) {
    res.redirect('date-of-birth')
    next()
  })

  router.post('/already-registered', function (req, res, next) {
    res.redirect('profile')
    next()
  })
}
