const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../../helpers/reference-id-helper')
const ValidationError = require('../../../../services/errors/validation-error')
const expenseUrlRouter = require('../../../../services/routing/expenses-url-router')
const TaxiExpense = require('../../../../services/domain/expenses/taxi-expense')
const insertExpense = require('../../../../services/data/insert-expense')
const getIsAdvanceClaim = require('../../../../services/data/get-is-advance-claim')

const REFERENCE_SESSION_ERROR = '?error=expired'

module.exports = function (router) {
  router.get('/apply/eligibility/claim/taxi', function (req, res) {
    UrlPathValidator(req.params)

    if (!req.session ||
      !req.session.claimType ||
      !req.session.referenceId ||
      !req.session.decryptedRef ||
      !req.session.advanceOrPast ||
      !req.session.claimId) {
      return res.redirect(`/apply/first-time/new-eligibility/date-of-birth${REFERENCE_SESSION_ERROR}`)
    }

    getIsAdvanceClaim(req.session.claimId)
      .then(function (isAdvanceClaim) {
        return res.render('apply/eligibility/claim/taxi-details', {
          claimType: req.session.claimType,
          referenceId: req.session.referenceId,
          claimId: req.session.claimId,
          params: expenseUrlRouter.parseParams(req.query),
          redirectUrl: expenseUrlRouter.getRedirectUrl(req),
          isAdvanceClaim: isAdvanceClaim
        })
      })
  })

  router.post('/apply/eligibility/claim/taxi', function (req, res, next) {
    UrlPathValidator(req.params)
    var referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.session.referenceId)

    if (!req.session ||
      !req.session.claimType ||
      !req.session.referenceId ||
      !req.session.decryptedRef ||
      !req.session.advanceOrPast ||
      !req.session.claimId) {
      return res.redirect(`/apply/first-time/new-eligibility/date-of-birth${REFERENCE_SESSION_ERROR}`)
    }

    try {
      var expense = new TaxiExpense(
        req.body.cost,
        req.body.from,
        req.body.to
      )

      insertExpense(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, req.session.claimId, expense)
        .then(function () {
          return res.redirect(expenseUrlRouter.getRedirectUrl(req))
        })
        .catch(function (error) {
          next(error)
        })
    } catch (error) {
      if (error instanceof ValidationError) {
        getIsAdvanceClaim(req.session.claimId)
          .then(function (isAdvanceClaim) {
            return res.status(400).render('apply/eligibility/claim/taxi-details', {
              errors: error.validationErrors,
              claimType: req.session.claimType,
              referenceId: req.session.referenceId,
              claimId: req.session.claimId,
              params: expenseUrlRouter.parseParams(req.query),
              redirectUrl: expenseUrlRouter.getRedirectUrl(req),
              expense: req.body,
              isAdvanceClaim: isAdvanceClaim
            })
          })
      } else {
        throw error
      }
    }
  })
}
