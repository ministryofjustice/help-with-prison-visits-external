module.exports = function (router) {
  router.get('/profile', function (req, res, next) {
    res.render('claim/profile')
    next()
  })

  router.post('/profile', function (req, res, next) {
    res.redirect('confirm-your-details')
    next()
  })
}
