const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const expenseUrlRouter = require('../../../../services/routing/expenses-url-router')
const FerryExpense = require('../../../../services/domain/expenses/ferry-expense')
const insertExpense = require('../../../../services/data/insert-expense')

module.exports = function (router) {
  router.get('/first-time-claim/eligibility/:reference/claim/:claimId/ferry', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('first-time/eligibility/claim/ferry-details', {
      reference: req.params.reference,
      claimId: req.params.claimId,
      params: expenseUrlRouter.parseParams(req.query)
    })
  })

  router.post('/first-time-claim/eligibility/:reference/claim/:claimId/ferry', function (req, res) {
    UrlPathValidator(req.params)

    var expense = new FerryExpense(
      req.params.claimId,
      req.body.cost,
      req.body.from,
      req.body.to,
      req.body['return-journey'],
      req.body['ticket-type']
    )

    insertExpense(expense)
      .then(function () {
        return res.redirect(expenseUrlRouter.getRedirectUrl(req))
      })
  })
}
