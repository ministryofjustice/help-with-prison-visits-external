const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../../helpers/reference-id-helper')
const ValidationError = require('../../../../services/errors/validation-error')
const expenseUrlRouter = require('../../../../services/routing/expenses-url-router')
const BusExpense = require('../../../../services/domain/expenses/bus-expense')
const insertExpense = require('../../../../services/data/insert-expense')
const getExpenseOwnerData = require('../../../../services/data/get-expense-owner-data')
const getIsAdvanceClaim = require('../../../../services/data/get-is-advance-claim')

const REFERENCE_SESSION_ERROR = '?error=expired'

module.exports = function (router) {
  router.get('/apply/eligibility/claim/bus', function (req, res) {
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

    getIsAdvanceClaim(req.session.claimId)
      .then(function (isAdvanceClaim) {
        return getExpenseOwnerData(req.session.claimId, referenceAndEligibilityId.id, referenceAndEligibilityId.reference)
          .then(function (expenseOwnerData) {
            return res.render('apply/eligibility/claim/bus-details', {
              claimType: req.session.claimType,
              referenceId: req.session.referenceId,
              claimId: req.session.claimId,
              expenseOwners: expenseOwnerData,
              params: expenseUrlRouter.parseParams(req.query),
              redirectUrl: expenseUrlRouter.getRedirectUrl(req),
              isAdvanceClaim: isAdvanceClaim
            })
          })
      })
  })

  router.post('/apply/eligibility/claim/bus', function (req, res, next) {
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
      var expense = new BusExpense(
        req.body.cost,
        req.body.from,
        req.body.to,
        req.body['return-journey'],
        req.body['ticket-owner']
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
            return getExpenseOwnerData(req.session.claimId, referenceAndEligibilityId.id, referenceAndEligibilityId.reference)
              .then(function (expenseOwnerData) {
                return res.status(400).render('apply/eligibility/claim/bus-details', {
                  errors: error.validationErrors,
                  claimType: req.session.claimType,
                  referenceId: req.session.referenceId,
                  claimId: req.session.claimId,
                  expenseOwners: expenseOwnerData,
                  params: expenseUrlRouter.parseParams(req.query),
                  redirectUrl: expenseUrlRouter.getRedirectUrl(req),
                  expense: req.body,
                  isAdvanceClaim: isAdvanceClaim
                })
              })
          })
      } else {
        throw error
      }
    }
  })
}
