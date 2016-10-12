module.exports = function (router) {
  router.get('/about-the-prisoner', function (req, res, next) {
    res.render('eligibility/about-the-prisoner')
    next()
  })

  router.post('/about-the-prisoner', function (req, res, next) {
    res.redirect('about-you')
    next()
  })
}
