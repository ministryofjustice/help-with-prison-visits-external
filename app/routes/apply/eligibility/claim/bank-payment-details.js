const insertBankAccountDetailsForClaim = require('../../../../services/data/insert-bank-account-details-for-claim')
const ValidationError = require('../../../../services/errors/validation-error')
const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../../helpers/reference-id-helper')
const config = require('../../../../../config')
const BankAccountDetails = require('../../../../services/domain/bank-account-details')
const SessionHandler = require('../../../../services/validators/session-handler')

module.exports = function (router) {
  router.get('/apply/eligibility/claim/bank-payment-details', function (req, res) {
    UrlPathValidator(req.params)
    var isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    return res.render('apply/eligibility/claim/bank-payment-details', {
      claimType: req.session.claimType,
      referenceId: req.session.referenceId,
      claimId: req.session.claimId,
      isAdvance: req.query.isAdvance,
      privateBeta: config.PRIVATE_BETA_TOGGLE
    })
  })

  router.post('/apply/eligibility/claim/bank-payment-details', function (req, res, next) {
    UrlPathValidator(req.params)
    var isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    var referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.session.referenceId)

    try {
      var bankAccountDetails = new BankAccountDetails(req.body.AccountNumber, req.body.SortCode)
      var redirectURL = `/apply/eligibility/claim/declaration?isAdvance=${req.query.isAdvance}`
      insertBankAccountDetailsForClaim(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, req.session.claimId, bankAccountDetails)
        .then(function () {
          return res.redirect(redirectURL)
        })
        .catch(function (error) {
          next(error)
        })
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('apply/eligibility/claim/bank-payment-details', {
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
