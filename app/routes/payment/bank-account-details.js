var validator = require('../../services/validators/payment/bank-account-details-validator')

module.exports = function (router) {
  router.get('/bank-account-details', function (req, res) {
    return res.render('payment/bank-account-details')
  })

  router.post('/bank-account-details', function (req, res) {
    var validationErrors = validator(req.body)

    if (validationErrors) {
      return res.status(400).render('payment/bank-account-details', {
        bankDetails: req.body,
        errors: validationErrors
      })
    }
    return res.redirect('/application-submitted/1234567')
  })
}
