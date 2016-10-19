module.exports = function (router) {
  router.get('/bank-account-details', function (req, res, next) {
    res.render('payment/bank-account-details')
    next()
  })

  router.post('/bank-account-details', function (req, res, next) {
    res.redirect('application-submitted/1234567')
    next()
  })
}
