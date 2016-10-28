const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const expenseUrlRouter = require('../../../../services/routing/expenses-url-router')
const PlaneExpense = require('../../../../services/domain/expenses/plane-expense')
const insertExpense = require('../../../../services/data/insert-expense')

module.exports = function (router) {
  router.get('/first-time-claim/eligibility/:reference/claim/:claimId/plane', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('first-time/eligibility/claim/plane-details', {
      reference: req.params.reference,
      claimId: req.params.claimId,
      params: expenseUrlRouter.parseParams(req.query)
    })
  })

  router.post('/first-time-claim/eligibility/:reference/claim/:claimId/plane', function (req, res) {
    UrlPathValidator(req.params)

    var expense = new PlaneExpense(
      req.params.claimId,
      req.body.cost,
      req.body.from,
      req.body.to,
      req.body['return-journey']
    )

    insertExpense(expense)
      .then(function () {
        return res.redirect(expenseUrlRouter.getRedirectUrl(req))
      })
  })
}
