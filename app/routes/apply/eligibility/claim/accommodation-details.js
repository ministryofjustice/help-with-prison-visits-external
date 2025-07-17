const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../../helpers/reference-id-helper')
const ValidationError = require('../../../../services/errors/validation-error')
const expenseUrlRouter = require('../../../../services/routing/expenses-url-router')
const AccommodationExpense = require('../../../../services/domain/expenses/accommodation-expense')
const insertExpense = require('../../../../services/data/insert-expense')
const getIsAdvanceClaim = require('../../../../services/data/get-is-advance-claim')
const SessionHandler = require('../../../../services/validators/session-handler')

module.exports = router => {
  router.get('/apply/eligibility/claim/accommodation', (req, res) => {
    UrlPathValidator(req.params)
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    getIsAdvanceClaim(req.session.claimId)
      .then(function (isAdvanceClaim) {
        return res.render('apply/eligibility/claim/accommodation-details', {
          claimType: req.session.claimType,
          referenceId: req.session.referenceId,
          claimId: req.session.claimId,
          params: expenseUrlRouter.parseParams(req.query),
          redirectUrl: expenseUrlRouter.getRedirectUrl(req),
          isAdvanceClaim
        })
      })
  })

  router.post('/apply/eligibility/claim/accommodation', (req, res, next) => {
    UrlPathValidator(req.params)
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    const referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.session.referenceId)

    try {
      const expense = new AccommodationExpense(
        req.body?.cost,
        req.body?.duration
      )

      insertExpense(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, req.session.claimId, expense)
        .then(() => {
          return res.redirect(expenseUrlRouter.getRedirectUrl(req))
        })
        .catch(error => {
          next(error)
        })
    } catch (error) {
      if (error instanceof ValidationError) {
        getIsAdvanceClaim(req.session.claimId)
          .then(function (isAdvanceClaim) {
            return res.status(400).render('apply/eligibility/claim/accommodation-details', {
              errors: error.validationErrors,
              claimType: req.session.claimType,
              referenceId: req.session.referenceId,
              claimId: req.session.claimId,
              params: expenseUrlRouter.parseParams(req.query),
              redirectUrl: expenseUrlRouter.getRedirectUrl(req),
              expense: req.body ?? {},
              isAdvanceClaim
            })
          })
      } else {
        throw error
      }
    }
  })
}
