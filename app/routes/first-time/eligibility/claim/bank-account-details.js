const BankAccountDetails = require('../../../../services/domain/bank-account-details')
const insertBankAccountDetailsForClaim = require('../../../../services/data/insert-bank-account-details-for-claim')
const submitFirstTimeClaim = require('../../../../services/data/submit-first-time-claim')
const ValidationError = require('../../../../services/errors/validation-error')
const UrlPathValidator = require('../../../../services/validators/url-path-validator')

module.exports = function (router) {
  router.get('/first-time-claim/eligibility/:reference/claim/:claimId/bank-account-details', function (req, res) {
    UrlPathValidator.validate(req.params)
    return res.render('first-time/eligibility/claim/bank-account-details', {
      reference: req.params.reference,
      claimId: req.params.claimId
    })
  })

  router.post('/first-time-claim/eligibility/:reference/claim/:claimId/bank-account-details', function (req, res) {
    UrlPathValidator.validate(req.params)
    try {
      var bankAccountDetails = new BankAccountDetails(req.body.AccountNumber, req.body.SortCode)
      insertBankAccountDetailsForClaim(req.params.claimId, bankAccountDetails)
        .then(function () {
          return submitFirstTimeClaim(req.params.reference, req.params.claimId)
            .then(function () {
              return res.redirect(`/application-submitted/${req.params.reference}`)
            })
        })
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('first-time/eligibility/claim/bank-account-details', {
          bankDetails: req.body,
          errors: error.validationErrors,
          reference: req.params.reference,
          claimId: req.params.claimId
        })
      } else {
        throw error
      }
    }
  })
}
