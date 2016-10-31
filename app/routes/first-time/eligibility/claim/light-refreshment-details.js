const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const ValidationError = require('../../../../services/errors/validation-error')
const expenseUrlRouter = require('../../../../services/routing/expenses-url-router')
const RefreshmentExpense = require('../../../../services/domain/expenses/refreshment-expense')
const insertExpense = require('../../../../services/data/insert-expense')

module.exports = function (router) {
  router.get('/first-time-claim/eligibility/:reference/claim/:claimId/refreshment', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('first-time/eligibility/claim/light-refreshment-details', {
      reference: req.params.reference,
      claimId: req.params.claimId,
      params: expenseUrlRouter.parseParams(req.query)
    })
  })

  router.post('/first-time-claim/eligibility/:reference/claim/:claimId/refreshment', function (req, res) {
    UrlPathValidator(req.params)

    try {
      var expense = new RefreshmentExpense(
        req.params.claimId,
        req.body.cost,
        req.body['travel-time']
      )

      insertExpense(expense)
        .then(function () {
          return res.redirect(expenseUrlRouter.getRedirectUrl(req))
        })
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('first-time/eligibility/claim/light-refreshment-details', {
          errors: error.validationErrors,
          reference: req.params.reference,
          claimId: req.params.claimId,
          expense: req.body
        })
      } else {
        throw error
      }
    }
  })
}
