const Expenses = require('../../../../services/domain/expenses/expenses')
const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const expenseUrlRouter = require('../../../../services/routing/expenses-url-router')
const ValidationError = require('../../../../services/errors/validation-error')
const getClaimSummary = require('../../../../services/data/get-claim-summary')
const getIsAdvanceClaim = require('../../../../services/data/get-is-advance-claim')
const SessionHandler = require('../../../../services/validators/session-handler')
const NORTHERN_IRELAND = 'Northern Ireland'

module.exports = router => {
  router.get('/apply/eligibility/claim/expenses', (req, res) => {
    UrlPathValidator(req.params)
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    getClaimSummary(req.session.claimId, req.session.claimType)
      .then(claimDetails => {
        getIsAdvanceClaim(req.session.claimId)
          .then(function (isAdvanceClaim) {
            const isNorthernIrelandClaim = claimDetails.claim.Country === NORTHERN_IRELAND

            return res.render('apply/eligibility/claim/expenses', {
              claimType: req.session.claimType,
              referenceId: req.session.referenceId,
              claimId: req.session.claimId,
              isNorthernIrelandClaim,
              isAdvanceClaim
            })
          })
      })
  })

  router.post('/apply/eligibility/claim/expenses', (req, res) => {
    UrlPathValidator(req.params)
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    try {
      new Expenses(req.body?.expenses) // eslint-disable-line no-new
      return res.redirect(expenseUrlRouter.getRedirectUrl(req))
    } catch (error) {
      if (error instanceof ValidationError) {
        getClaimSummary(req.session.claimId, req.session.claimType)
          .then(claimDetails => {
            getIsAdvanceClaim(req.session.claimId)
              .then(function (isAdvanceClaim) {
                const isNorthernIrelandClaim = claimDetails.claim.Country === NORTHERN_IRELAND

                return res.status(400).render('apply/eligibility/claim/expenses', {
                  errors: error.validationErrors,
                  claimType: req.session.claimType,
                  referenceId: req.session.referenceId,
                  claimId: req.session.claimId,
                  isNorthernIrelandClaim,
                  isAdvanceClaim
                })
              })
          })
      } else {
        throw error
      }
    }
  })
}
