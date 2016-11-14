const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../../helpers/reference-id-helper')
const ValidationError = require('../../../../services/errors/validation-error')
const expenseUrlRouter = require('../../../../services/routing/expenses-url-router')
const CarExpense = require('../../../../services/domain/expenses/car-expense')
const getTravellingFromAndTo = require('../../../../services/data/get-travelling-from-and-to')
const insertCarExpenses = require('../../../../services/data/insert-car-expenses')

module.exports = function (router) {
  router.get('/first-time/eligibility/:referenceId/claim/:claimId/car', function (req, res, next) {
    UrlPathValidator(req.params)
    var referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.params.referenceId)

    getTravellingFromAndTo(referenceAndEligibilityId.reference, referenceAndEligibilityId.id)
      .then(function (result) {
        return res.render('first-time/eligibility/claim/car-details', {
          referenceId: req.params.referenceId,
          claimId: req.params.claimId,
          params: expenseUrlRouter.parseParams(req.query),
          expense: result
        })
      })
      .catch(function (error) {
        next(error)
      })
  })

  router.post('/first-time/eligibility/:referenceId/claim/:claimId/car', function (req, res, next) {
    UrlPathValidator(req.params)
    var referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.params.referenceId)

    try {
      var expense = new CarExpense(
        req.body.from,
        req.body.to,
        req.body.toll,
        req.body[ 'toll-cost' ],
        req.body[ 'parking-charge' ],
        req.body[ 'parking-charge-cost' ]
      )

      insertCarExpenses(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, req.params.claimId, expense)
        .then(function () {
          return res.redirect(expenseUrlRouter.getRedirectUrl(req))
        })
        .catch(function (error) {
          next(error)
        })
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('first-time/eligibility/claim/car-details', {
          errors: error.validationErrors,
          referenceId: req.params.referenceId,
          claimId: req.params.claimId,
          params: expenseUrlRouter.parseParams(req.query),
          expense: req.body
        })
      } else {
        throw error
      }
    }
  })
}
