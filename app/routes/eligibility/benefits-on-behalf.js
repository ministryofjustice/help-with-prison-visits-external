module.exports = function (router) {
  router.get('/benefits-on-behalf', function (req, res, next) {
    res.render('eligibility/benefits-on-behalf')
    next()
  })

  router.post('/benefits-on-behalf', function (req, res, next) {
    res.redirect('about-the-prisoner')
    next()
  })
}
