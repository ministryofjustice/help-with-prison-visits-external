module.exports = function (router) {
  router.get('/journey-assistance', function (req, res, next) {
    res.render('eligibility/journey-assistance')
    next()
  })

  router.post('/journey-assistance', function (req, res, next) {
    res.redirect('benefits')
    next()
  })
}
