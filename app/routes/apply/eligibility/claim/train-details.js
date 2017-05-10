const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../../helpers/reference-id-helper')
const ValidationError = require('../../../../services/errors/validation-error')
const expenseUrlRouter = require('../../../../services/routing/expenses-url-router')
const TrainExpense = require('../../../../services/domain/expenses/train-expense')
const insertExpense = require('../../../../services/data/insert-expense')
const getExpenseOwnerData = require('../../../../services/data/get-expense-owner-data')
const getIsAdvanceClaim = require('../../../../services/data/get-is-advance-claim')

const REFERENCE_SESSION_ERROR = '?error=expired'

module.exports = function (router) {
  router.get('/apply/eligibility/claim/train', function (req, res) {
    UrlPathValidator(req.params)

    if (!req.session ||
      !req.session.claimType ||
      !req.session.referenceId ||
      !req.session.decryptedRef ||
      !req.session.advanceOrPast ||
      !req.session.claimId) {
      return res.redirect(`/apply/first-time/new-eligibility/date-of-birth${REFERENCE_SESSION_ERROR}`)
    }

    var claim = {}
    var referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.session.referenceId)
    getIsAdvanceClaim(req.session.claimId)
      .then(function (isAdvanceClaim) {
        claim.isAdvanceClaim = isAdvanceClaim
      })
      .then(function () {
        return getExpenseOwnerData(req.session.claimId, referenceAndEligibilityId.id, referenceAndEligibilityId.reference)
      })
      .then(function (expenseOwnerData) {
        return res.render('apply/eligibility/claim/train-details', {
          claimType: req.session.claimType,
          referenceId: req.session.referenceId,
          claimId: req.session.claimId,
          expenseOwners: expenseOwnerData,
          params: expenseUrlRouter.parseParams(req.query),
          redirectUrl: expenseUrlRouter.getRedirectUrl(req),
          isAdvanceClaim: claim.isAdvanceClaim
        })
      })
  })

  router.post('/apply/eligibility/claim/train', function (req, res, next) {
    UrlPathValidator(req.params)
    var referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.session.referenceId)
    var isAdvanceClaim = req.body.isAdvanceClaim === 'true'

    if (!req.session ||
      !req.session.claimType ||
      !req.session.referenceId ||
      !req.session.decryptedRef ||
      !req.session.advanceOrPast ||
      !req.session.claimId) {
      return res.redirect(`/apply/first-time/new-eligibility/date-of-birth${REFERENCE_SESSION_ERROR}`)
    }

    try {
      var expense = new TrainExpense(
        req.body.cost,
        req.body.from,
        req.body.to,
        req.body['return-journey'],
        req.body['ticket-owner'],
        req.body['departure-time'],
        req.body['return-time-input'],
        isAdvanceClaim
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
        return getExpenseOwnerData(req.session.claimId, referenceAndEligibilityId.id, referenceAndEligibilityId.reference)
          .then(function (expenseOwnerData) {
            return res.status(400).render('apply/eligibility/claim/train-details', {
              errors: error.validationErrors,
              claimType: req.session.claimType,
              referenceId: req.session.referenceId,
              claimId: req.session.claimId,
              expenseOwners: expenseOwnerData,
              params: expenseUrlRouter.parseParams(req.query),
              redirectUrl: expenseUrlRouter.getRedirectUrl(req),
              expense: req.body,
              claim: { IsAdvanceClaim: isAdvanceClaim }
            })
          })
      } else {
        throw error
      }
    }
  })
}
