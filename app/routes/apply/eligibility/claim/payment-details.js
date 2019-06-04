const PaymentDetails = require('../../../../services/domain/payment-details')
const ValidationError = require('../../../../services/errors/validation-error')
const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const paymentMethods = require('../../../../constants/payment-method-enum')
const config = require('../../../../../config')
const SessionHandler = require('../../../../services/validators/session-handler')

module.exports = function (router) {
  router.get('/apply/eligibility/claim/payment-details', function (req, res) {
    UrlPathValidator(req.params)
    var isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    return res.render('apply/eligibility/claim/payment-details', {
      claimType: req.session.claimType,
      referenceId: req.session.referenceId,
      claimId: req.session.claimId,
      isAdvance: req.query.isAdvance,
      privateBeta: config.PRIVATE_BETA_TOGGLE
    })
  })

  router.post('/apply/eligibility/claim/payment-details', function (req, res, next) {
    UrlPathValidator(req.params)
    var isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    try {
      var paymentDetails = new PaymentDetails(req.body.PaymentMethod)
      req.session.paymentMethod = paymentDetails.paymentMethod
      var redirectURL
      if (paymentDetails.paymentMethod === paymentMethods.PAYOUT.value) {
        redirectURL = `/apply/eligibility/claim/payout-confirmation?isAdvance=${req.query.isAdvance}`
      } else {
        redirectURL = `/apply/eligibility/claim/bank-payment-details?isAdvance=${req.query.isAdvance}`
      }
      return res.redirect(redirectURL)
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('apply/eligibility/claim/payment-details', {
          errors: error.validationErrors,
          claimType: req.session.claimType,
          paymentDetails: req.body,
          referenceId: req.session.referenceId,
          claimId: req.session.claimId,
          isAdvance: req.query.isAdvance,
          privateBeta: config.PRIVATE_BETA_TOGGLE
        })
      } else {
        throw error
      }
    }
  })
}
