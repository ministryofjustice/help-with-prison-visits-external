const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const expenseUrlRouter = require('../../../../services/routing/expenses-url-router')
const BusExpense = require('../../../../services/domain/expenses/bus-expense')
// const insertExpense = require('../../../../services/data/insert-expense')

module.exports = function (router) {
  router.get('/first-time-claim/eligibility/:reference/claim/:claimId/bus', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('first-time/eligibility/claim/bus-details', {
      reference: req.params.reference,
      claimId: req.params.claimId,
      params: expenseUrlRouter.parseParams(req.query)
    })
  })

  // TODO: Add form validation.
  router.post('/first-time-claim/eligibility/:reference/claim/:claimId/bus', function (req, res) {
    UrlPathValidator(req.params)

    var expense = new BusExpense(
      req.params.claimId,
      req.body.from,
      req.body.to,
      req.body['return-journey'],
      req.body.cost
    )
    console.dir(expense)

    // insertExpense(expense)
    //   .then(function () {
    //     console.log('After insert')
    //     // TODO: Should redirect only if successful
    //   })
    // // TODO: Handle error case

    return res.redirect(expenseUrlRouter.getRedirectUrl(req))
  })
}
