const PaymentDetails = require('../../../../services/domain/payment-details')
const insertBankAccountDetailsForClaim = require('../../../../services/data/insert-bank-account-details-for-claim')
const ValidationError = require('../../../../services/errors/validation-error')
const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../../helpers/reference-id-helper')
const paymentMethods = require('../../../../constants/payment-method-enum')
const getAddressAndLinkDetails = require('../../../../services/data/get-address-and-link-details')
const getChangeAddressLink = require('../../../helpers/get-change-address-link')
const config = require('../../../../../config')
const SessionHandler = require('../../../../services/validators/session-handler')

module.exports = function (router) {
  router.get('/apply/eligibility/claim/payment-details', function (req, res) {
    UrlPathValidator(req.params)
    var isValidSession = SessionHandler(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    getAddressAndLinkDetails(referenceIdHelper.extractReferenceId(req.session.referenceId).reference, req.session.claimId, req.session.claimType)
      .then(function (addressAndLinkDetails) {
        return res.render('apply/eligibility/claim/payment-details', {
          claimType: req.session.claimType,
          referenceId: req.session.referenceId,
          claimId: req.session.claimId,
          isAdvance: req.query.isAdvance,
          address: addressAndLinkDetails,
          privateBeta: config.PRIVATE_BETA_TOGGLE,
          changeAddressLink: getChangeAddressLink(req.session.claimType, req.session.referenceId, addressAndLinkDetails.DateOfBirth, addressAndLinkDetails.Benefit, addressAndLinkDetails.Relationship)
        })
      })
  })

  router.post('/apply/eligibility/claim/payment-details', function (req, res, next) {
    UrlPathValidator(req.params)
    var isValidSession = SessionHandler(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    var referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.session.referenceId)

    try {
      var paymentDetails = new PaymentDetails(req.body.PaymentMethod, req.body.AccountNumber, req.body.SortCode)
      var redirectURL = `/apply/eligibility/claim/declaration?isAdvance=${req.query.isAdvance}&paymentMethod=${paymentDetails.paymentMethod}`
      if (paymentDetails.paymentMethod === paymentMethods.PAYOUT.value) {
        return res.redirect(redirectURL)
      } else {
        insertBankAccountDetailsForClaim(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, req.session.claimId, paymentDetails)
          .then(function () {
            return res.redirect(redirectURL)
          })
          .catch(function (error) {
            next(error)
          })
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        getAddressAndLinkDetails(referenceIdHelper.extractReferenceId(req.session.referenceId).reference, req.session.claimId, req.session.claimType)
          .then(function (addressAndLinkDetails) {
            return res.status(400).render('apply/eligibility/claim/payment-details', {
              errors: error.validationErrors,
              claimType: req.session.claimType,
              paymentDetails: req.body,
              referenceId: req.session.referenceId,
              claimId: req.session.claimId,
              isAdvance: req.query.isAdvance,
              address: addressAndLinkDetails,
              privateBeta: config.PRIVATE_BETA_TOGGLE,
              changeAddressLink: getChangeAddressLink(req.session.claimType, req.session.referenceId, addressAndLinkDetails.DateOfBirth, addressAndLinkDetails.Benefit, addressAndLinkDetails.Relationship)
            })
          })
      } else {
        throw error
      }
    }
  })
}
