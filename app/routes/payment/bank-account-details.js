module.exports = function (router) {
  router.get('/bank-account-details', function (req, res) {
    res.render('payment/bank-account-details')
  })

  router.post('/bank-account-details', function (req, res) {
    res.redirect('application-submitted')
  })
}
