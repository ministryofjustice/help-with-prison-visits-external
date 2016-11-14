const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../../helpers/reference-id-helper')
const ValidationError = require('../../../../services/errors/validation-error')
const expenseUrlRouter = require('../../../../services/routing/expenses-url-router')
const HireExpense = require('../../../../services/domain/expenses/hire-expense')
const insertExpense = require('../../../../services/data/insert-expense')

module.exports = function (router) {
  router.get('/first-time/eligibility/:referenceId/claim/:claimId/hire', function (req, res) {
    UrlPathValidator(req.params)

    return res.render('first-time/eligibility/claim/car-hire-details', {
      referenceId: req.params.referenceId,
      claimId: req.params.claimId,
      params: expenseUrlRouter.parseParams(req.query)
    })
  })

  router.post('/first-time/eligibility/:referenceId/claim/:claimId/hire', function (req, res, next) {
    UrlPathValidator(req.params)
    var referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.params.referenceId)

    try {
      var expense = new HireExpense(
        req.params.claimId,
        req.body.cost,
        req.body.from,
        req.body.to,
        req.body.duration
      )

      insertExpense(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, req.params.claimId, expense)
        .then(function () {
          return res.redirect(expenseUrlRouter.getRedirectUrl(req))
        })
        .catch(function (error) {
          next(error)
        })
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('first-time/eligibility/claim/car-hire-details', {
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
