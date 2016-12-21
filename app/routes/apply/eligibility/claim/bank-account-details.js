const BankAccountDetails = require('../../../../services/domain/bank-account-details')
const insertBankAccountDetailsForClaim = require('../../../../services/data/insert-bank-account-details-for-claim')
const submitClaim = require('../../../../services/data/submit-claim')
const ValidationError = require('../../../../services/errors/validation-error')
const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../../helpers/reference-id-helper')

module.exports = function (router) {
  router.get('/apply/:claimType/eligibility/:referenceId/claim/:claimId/bank-account-details', function (req, res) {
    UrlPathValidator(req.params)

    return res.render('apply/eligibility/claim/bank-account-details', {
      claimType: req.params.claimType,
      referenceId: req.params.referenceId,
      claimId: req.params.claimId
    })
  })

  router.post('/apply/:claimType/eligibility/:referenceId/claim/:claimId/bank-account-details', function (req, res, next) {
    UrlPathValidator(req.params)
    var referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.params.referenceId)
    var assistedDigitalCaseWorker = req.cookies['apvs-assisted-digital']

    try {
      var bankAccountDetails = new BankAccountDetails(req.body.AccountNumber, req.body.SortCode, req.body.tAndC)
      insertBankAccountDetailsForClaim(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, req.params.claimId, bankAccountDetails)
        .then(function () {
          return submitClaim(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, req.params.claimId, req.params.claimType, assistedDigitalCaseWorker)
            .then(function () {
              return res.redirect(`/application-submitted/${referenceAndEligibilityId.reference}`)
            })
        })
        .catch(function (error) {
          next(error)
        })
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('apply/eligibility/claim/bank-account-details', {
          errors: error.validationErrors,
          claimType: req.params.claimType,
          bankDetails: req.body,
          referenceId: req.params.referenceId,
          claimId: req.params.claimId
        })
      } else {
        throw error
      }
    }
  })
}
