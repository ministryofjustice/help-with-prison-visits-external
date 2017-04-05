const PaymentDetails = require('../../../../services/domain/payment-details')
const insertBankAccountDetailsForClaim = require('../../../../services/data/insert-bank-account-details-for-claim')
const ValidationError = require('../../../../services/errors/validation-error')
const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../../helpers/reference-id-helper')
const paymentMethods = require('../../../../constants/payment-method-enum')
const getAddress = require('../../../../services/data/get-address')

module.exports = function (router) {
  router.get('/apply/:claimType/eligibility/:referenceId/claim/:claimId/payment-details', function (req, res) {
    UrlPathValidator(req.params)
    getAddress(referenceIdHelper.extractReferenceId(req.params.referenceId).reference, req.params.claimId, req.params.claimType)
      .then(function (address) {
        return res.render('apply/eligibility/claim/payment-details', {
          claimType: req.params.claimType,
          referenceId: req.params.referenceId,
          claimId: req.params.claimId,
          isAdvance: req.query.isAdvance,
          address: address
        })
      })
  })

  router.post('/apply/:claimType/eligibility/:referenceId/claim/:claimId/payment-details', function (req, res, next) {
    UrlPathValidator(req.params)
    var referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.params.referenceId)
    try {
      var paymentDetails = new PaymentDetails(req.body.AccountNumber, req.body.SortCode, req.body.payout)
      var paymentMethod = paymentDetails.payout ? paymentMethods.PAYOUT.value : paymentMethods.DIRECT_BANK_PAYMENT.value
      var redirectURL = `/apply/${req.params.claimType}/eligibility/${req.params.referenceId}/claim/${req.params.claimId}/declaration?isAdvance=${req.query.isAdvance}&paymentMethod=${paymentMethod}`
      if (paymentDetails.payout) {
        return res.redirect(redirectURL)
      } else {
        insertBankAccountDetailsForClaim(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, req.params.claimId, paymentDetails)
          .then(function () {
            return res.redirect(redirectURL)
          })
          .catch(function (error) {
            next(error)
          })
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        getAddress(referenceIdHelper.extractReferenceId(req.params.referenceId).reference, req.params.claimId, req.params.claimType)
          .then(function (address) {
            return res.status(400).render('apply/eligibility/claim/payment-details', {
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
