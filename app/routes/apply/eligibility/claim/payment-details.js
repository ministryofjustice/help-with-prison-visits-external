const PaymentDetails = require('../../../../services/domain/payment-details')
const ValidationError = require('../../../../services/errors/validation-error')
const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const SessionHandler = require('../../../../services/validators/session-handler')

module.exports = function (router) {
  router.get('/apply/eligibility/claim/payment-details', function (req, res) {
    UrlPathValidator(req.params)
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    return res.render('apply/eligibility/claim/payment-details', {
      claimType: req.session.claimType,
      referenceId: req.session.referenceId,
      claimId: req.session.claimId,
      isAdvance: req.query.isAdvance
    })
  })

  router.post('/apply/eligibility/claim/payment-details', function (req, res, next) {
    UrlPathValidator(req.params)
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    try {
      const paymentDetails = new PaymentDetails(req.body.PaymentMethod)
      req.session.paymentMethod = paymentDetails.paymentMethod
      return res.redirect(`/apply/eligibility/claim/bank-payment-details?isAdvance=${req.query.isAdvance}`)
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('apply/eligibility/claim/payment-details', {
          errors: error.validationErrors,
          claimType: req.session.claimType,
          paymentDetails: req.body,
          referenceId: req.session.referenceId,
          claimId: req.session.claimId,
          isAdvance: req.query.isAdvance
        })
      } else {
        throw error
      }
    }
  })
}
