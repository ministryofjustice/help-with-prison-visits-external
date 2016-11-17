const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../../helpers/reference-id-helper')
const ValidationError = require('../../../../services/errors/validation-error')
const expenseUrlRouter = require('../../../../services/routing/expenses-url-router')
const TaxiExpense = require('../../../../services/domain/expenses/taxi-expense')
const insertExpense = require('../../../../services/data/insert-expense')

module.exports = function (router) {
  router.get('/apply/:claimType/eligibility/:referenceId/claim/:claimId/taxi', function (req, res) {
    UrlPathValidator(req.params)

    return res.render('apply/eligibility/claim/taxi-details', {
      claimType: req.params.claimType,
      referenceId: req.params.referenceId,
      claimId: req.params.claimId,
      params: expenseUrlRouter.parseParams(req.query)
    })
  })

  router.post('/apply/:claimType/eligibility/:referenceId/claim/:claimId/taxi', function (req, res, next) {
    UrlPathValidator(req.params)
    var referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.params.referenceId)

    try {
      var expense = new TaxiExpense(
        req.body.cost,
        req.body.from,
        req.body.to
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
        return res.status(400).render('apply/eligibility/claim/taxi-details', {
          errors: error.validationErrors,
          claimType: req.params.claimType,
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
