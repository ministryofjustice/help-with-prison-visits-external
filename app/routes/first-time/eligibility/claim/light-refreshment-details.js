const UrlPathValidator = require('../../../../services/validators/url-path-validator')
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

    var expense = new RefreshmentExpense(
      req.params.claimId,
      req.body.cost,
      req.body['travel-time']
    )

    insertExpense(expense)
      .then(function () {
        return res.redirect(expenseUrlRouter.getRedirectUrl(req))
      })
  })
}
