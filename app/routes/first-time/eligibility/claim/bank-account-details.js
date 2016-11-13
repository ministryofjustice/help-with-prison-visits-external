const BankAccountDetails = require('../../../../services/domain/bank-account-details')
const insertBankAccountDetailsForClaim = require('../../../../services/data/insert-bank-account-details-for-claim')
const submitFirstTimeClaim = require('../../../../services/data/submit-first-time-claim')
const ValidationError = require('../../../../services/errors/validation-error')
const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../../helpers/reference-id-helper')

module.exports = function (router) {
  router.get('/first-time/eligibility/:referenceId/claim/:claimId/bank-account-details', function (req, res) {
    UrlPathValidator(req.params)

    return res.render('first-time/eligibility/claim/bank-account-details', {
      referenceId: req.params.referenceId,
      claimId: req.params.claimId
    })
  })

  router.post('/first-time/eligibility/:referenceId/claim/:claimId/bank-account-details', function (req, res, next) {
    UrlPathValidator(req.params)
    var referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.params.referenceId)

    try {
      var bankAccountDetails = new BankAccountDetails(req.body.AccountNumber, req.body.SortCode)
      insertBankAccountDetailsForClaim(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, req.params.claimId, bankAccountDetails)
        .then(function () {
          return submitFirstTimeClaim(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, req.params.claimId)
            .then(function () {
              return res.redirect(`/application-submitted/${req.params.referenceId}`)
            })
        })
        .catch(function (error) {
          next(error)
        })
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('first-time/eligibility/claim/bank-account-details', {
          bankDetails: req.body,
          errors: error.validationErrors,
          referenceId: req.params.referenceId,
          claimId: req.params.claimId
        })
      } else {
        throw error
      }
    }
  })
}
