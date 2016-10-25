var validator = require('../../../../services/validators/payment/bank-account-details-validator')
const bankAccountDetails = require('../../../../services/data/bank-account-details')

module.exports = function (router) {
  router.get('/first-time-claim/eligibility/:reference/claim/:claimId/bank-account-details', function (req, res) {
    // TODO: Validate URL path
    return res.render('first-time/eligibility/claim/bank-account-details')
  })

  router.post('/first-time-claim/eligibility/:reference/claim/:claimId/bank-account-details', function (req, res) {
    // TODO: Validate URL path
    var validationErrors = validator(req.body)
    var bankAccountData = req.body

    if (validationErrors) {
      console.log(validationErrors)
      return res.status(400).render('first-time/eligibility/claim/bank-account-details', {
        bankDetails: req.body,
        errors: validationErrors
      })
    }

    bankAccountDetails.insert(req.params.claimId, bankAccountData)
      .then(function () {
        return res.redirect(`/application-submitted/${req.params.reference}`)
      })
  })
}
