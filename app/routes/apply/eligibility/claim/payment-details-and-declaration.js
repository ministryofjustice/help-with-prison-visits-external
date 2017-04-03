const PaymentDetails = require('../../../../services/domain/payment-details')
const insertBankAccountDetailsForClaim = require('../../../../services/data/insert-bank-account-details-for-claim')
const submitClaim = require('../../../../services/data/submit-claim')
const ValidationError = require('../../../../services/errors/validation-error')
const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../../helpers/reference-id-helper')
const encrypt = require('../../../../services/helpers/encrypt')
const paymentMethods = require('../../../../constants/payment-method-enum')
const getAddress = require('../../../../services/data/get-address')
const getIsAdvanceClaim = require('../../../../services/data/get-is-advance-claim')
const checkStatusForFinishingClaim = require('../../../../services/data/check-status-for-finishing-claim')

module.exports = function (router) {
  router.get('/apply/:claimType/eligibility/:referenceId/claim/:claimId/payment-details-and-declaration', function (req, res) {
    UrlPathValidator(req.params)
    getAddress(referenceIdHelper.extractReferenceId(req.params.referenceId).reference, req.params.claimId, req.params.claimType)
      .then(function (address) {
        return res.render('apply/eligibility/claim/payment-details-and-declaration', {
          claimType: req.params.claimType,
          referenceId: req.params.referenceId,
          claimId: req.params.claimId,
          isAdvance: req.query.isAdvance,
          address: address
        })
      })
  })

  router.post('/apply/:claimType/eligibility/:referenceId/claim/:claimId/payment-details-and-declaration', function (req, res, next) {
    UrlPathValidator(req.params)
    var referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.params.referenceId)
    var assistedDigitalCaseWorker = req.cookies['apvs-assisted-digital']
    try {
      var paymentDetails = new PaymentDetails(req.body.AccountNumber, req.body.SortCode, req.body['terms-and-conditions-input'], req.body.payout)
      var paymentMethod = paymentDetails.payout ? paymentMethods.PAYOUT.value : paymentMethods.DIRECT_BANK_PAYMENT.value
      return checkStatusForFinishingClaim(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, req.params.claimId)
        .then(function (claimInProgress) {
          if (claimInProgress) {
            if (paymentDetails.payout) {
              return finishClaim(res, referenceAndEligibilityId.reference, referenceAndEligibilityId.id, req.params.claimId, req.params.claimType, assistedDigitalCaseWorker, paymentMethod)
                .catch(function (error) {
                  next(error)
                })
            } else {
              insertBankAccountDetailsForClaim(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, req.params.claimId, paymentDetails)
                .then(function () {
                  return finishClaim(res, referenceAndEligibilityId.reference, referenceAndEligibilityId.id, req.params.claimId, req.params.claimType, assistedDigitalCaseWorker, paymentMethod)
                })
                .catch(function (error) {
                  next(error)
                })
            }
          } else {
            redirectApplicationSubmitted(res, referenceAndEligibilityId.reference, req.params.claimId)
          }
        })
    } catch (error) {
      if (error instanceof ValidationError) {
        getAddress(referenceIdHelper.extractReferenceId(req.params.referenceId).reference, req.params.claimId, req.params.claimType)
          .then(function (address) {
            return res.status(400).render('apply/eligibility/claim/payment-details-and-declaration', {
              errors: error.validationErrors,
              claimType: req.params.claimType,
              paymentDetailsAndDeclaration: req.body,
              referenceId: req.params.referenceId,
              claimId: req.params.claimId,
              isAdvance: req.query.isAdvance,
              address: address
            })
          })
      } else {
        throw error
      }
    }
  })
}

function finishClaim (res, reference, eligibilityId, claimId, claimType, assistedDigitalCaseWorker, paymentMethod) {
  return submitClaim(reference, eligibilityId, claimId, claimType, assistedDigitalCaseWorker, paymentMethod)
    .then(function () {
      return redirectApplicationSubmitted(res, reference, claimId)
    })
}

function redirectApplicationSubmitted (res, reference, claimId) {
  getIsAdvanceClaim(claimId)
    .then(function (isAdvanceClaim) {
      var advanceOrPast = isAdvanceClaim ? 'advance' : 'past'
      var encryptedRef = encrypt(reference)
      return res.redirect(`/application-submitted/${advanceOrPast}/${encryptedRef}`)
    })
}
