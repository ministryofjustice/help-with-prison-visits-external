const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const expenseUrlRouter = require('../../../../services/routing/expenses-url-router')
const AccommodationExpense = require('../../../../services/domain/expenses/accommodation-expense')
const insertExpense = require('../../../../services/data/insert-expense')

module.exports = function (router) {
  router.get('/first-time-claim/eligibility/:reference/claim/:claimId/accommodation', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('first-time/eligibility/claim/accommodation-details', {
      reference: req.params.reference,
      claimId: req.params.claimId,
      params: expenseUrlRouter.parseParams(req.query)
    })
  })

  router.post('/first-time-claim/eligibility/:reference/claim/:claimId/accommodation', function (req, res) {
    UrlPathValidator(req.params)

    var expense = new AccommodationExpense(
      req.params.claimId,
      req.body.cost,
      req.body.duration
    )

    insertExpense(expense)
      .then(function () {
        return res.redirect(expenseUrlRouter.getRedirectUrl(req))
      })
  })
}
