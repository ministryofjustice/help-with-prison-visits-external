module.exports = function (router) {
  router.get('/your-journey', function (req, res, next) {
    res.render('claim/your-journey')
    next()
  })

  router.post('/your-journey', function (req, res, next) {
    res.redirect('transport')
    next()
  })
}
