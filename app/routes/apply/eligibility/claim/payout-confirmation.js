const ValidationError = require('../../../../services/errors/validation-error')
const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../../helpers/reference-id-helper')
const getAddressAndLinkDetails = require('../../../../services/data/get-address-and-link-details')
const getChangeAddressLink = require('../../../helpers/get-change-address-link')
const config = require('../../../../../config')
const SessionHandler = require('../../../../services/validators/session-handler')
const PaymentDetails = require('../../../../services/domain/payment-details')

module.exports = function (router) {
  router.get('/apply/eligibility/claim/payout-confirmation', function (req, res) {
    UrlPathValidator(req.params)
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    const paymentDetails = new PaymentDetails('payout')
    req.session.paymentMethod = paymentDetails.paymentMethod

    getAddressAndLinkDetails(referenceIdHelper.extractReferenceId(req.session.referenceId).reference, req.session.claimId, req.session.claimType)
      .then(function (addressAndLinkDetails) {
        return res.render('apply/eligibility/claim/payout-confirmation', {
          claimType: req.session.claimType,
          referenceId: req.session.referenceId,
          claimId: req.session.claimId,
          isAdvance: req.query.isAdvance,
          address: addressAndLinkDetails,
          privateBeta: config.PRIVATE_BETA_TOGGLE,
          changeAddressLink: getChangeAddressLink(req.session.claimType)
        })
      })
  })

  router.post('/apply/eligibility/claim/payout-confirmation', function (req, res, next) {
    UrlPathValidator(req.params)
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    try {
      const redirectURL = `/apply/eligibility/claim/declaration?isAdvance=${req.query.isAdvance}`
      return res.redirect(redirectURL)
    } catch (error) {
      if (error instanceof ValidationError) {
        getAddressAndLinkDetails(referenceIdHelper.extractReferenceId(req.session.referenceId).reference, req.session.claimId, req.session.claimType)
          .then(function (addressAndLinkDetails) {
            return res.status(400).render('apply/eligibility/claim/payout-confirmation', {
              errors: error.validationErrors,
              claimType: req.session.claimType,
              paymentDetails: req.body,
              referenceId: req.session.referenceId,
              claimId: req.session.claimId,
              isAdvance: req.query.isAdvance,
              address: addressAndLinkDetails,
              privateBeta: config.PRIVATE_BETA_TOGGLE,
              changeAddressLink: getChangeAddressLink(req.session.claimType)
            })
          })
      } else {
        throw error
      }
    }
  })
}
