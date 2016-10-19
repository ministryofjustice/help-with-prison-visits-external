var validator = require('../../services/validators/payment/bank-account-details-validator')

module.exports = function (router) {
  router.get('/bank-account-details', function (req, res, next) {
    res.render('payment/bank-account-details')
    next()
  })

  router.post('/bank-account-details', function (req, res, next) {
    var validationErrors = validator(req.body)

    if (validationErrors) {
      res.status(400).render('payment/bank-account-details', {
        bankDetails: req.body,
        errors: validationErrors
      })
      return next()
    }
    res.redirect('/application-submitted/1234567')
    next()
  })
}
