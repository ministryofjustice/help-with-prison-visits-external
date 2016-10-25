const BankAccountDetails = require('../../../../services/domain/bank-account-details')
const bankAccountDetailsData = require('../../../../services/data/bank-account-details')
const ValidationError = require('../../../../services/errors/validation-error')

module.exports = function (router) {
  router.get('/first-time-claim/eligibility/:reference/claim/:claimId/bank-account-details', function (req, res) {
    // TODO: Validate URL path
    return res.render('first-time/eligibility/claim/bank-account-details')
  })

  router.post('/first-time-claim/eligibility/:reference/claim/:claimId/bank-account-details', function (req, res) {
    // TODO: Validate URL path
    try {
      var bankAccountDetails = new BankAccountDetails(req.body.AccountNumber, req.body.SortCode)
      bankAccountDetailsData.insert(req.params.claimId, bankAccountDetails)
        .then(function () {
          return res.redirect(`/application-submitted/${req.params.reference}`)
        })
    } catch (e) {
      if (e instanceof ValidationError) {
        return res.status(400).render('first-time/eligibility/claim/bank-account-details', {
          bankDetails: req.body,
          errors: e.validationErrors
        })
      } else {
        throw e
      }
    }
  })
}
