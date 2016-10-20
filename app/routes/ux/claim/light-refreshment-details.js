module.exports = function (router) {
  router.get('/light-refreshment-details', function (req, res, next) {
    res.render('ux/claim/light-refreshment-details')
    next()
  })

  router.post('/light-refreshment-details', function (req, res, next) {
    res.redirect('claim-summary')
    next()
  })
}
