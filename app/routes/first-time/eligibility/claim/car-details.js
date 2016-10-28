const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const expenseUrlRouter = require('../../../../services/routing/expenses-url-router')
const CarExpense = require('../../../../services/domain/expenses/car-expense')
const TollExpense = require('../../../../services/domain/expenses/toll-expense')
const ParkingExpense = require('../../../../services/domain/expenses/parking-expense')
const insertCarExpenses = require('../../../../services/data/insert-car-expenses')

module.exports = function (router) {
  // TODO: Replace the subbed 'to' and 'from' values with real values associated with this claim.
  router.get('/first-time-claim/eligibility/:reference/claim/:claimId/car', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('first-time/eligibility/claim/car-details', {
      reference: req.params.reference,
      claimId: req.params.claimId,
      params: expenseUrlRouter.parseParams(req.query),
      from: 'London',
      to: 'Hewell'
    })
  })

  router.post('/first-time-claim/eligibility/:reference/claim/:claimId/car', function (req, res) {
    UrlPathValidator(req.params)

    console.log(req.body)

    var carExpense = new CarExpense(
      req.params.claimId,
      req.body.from,
      req.body.to
    )

    var tollExpense
    if (req.body.toll) {
      tollExpense = new TollExpense(
        req.params.claimId,
        req.body[ 'toll-cost' ],
        req.body.from,
        req.body.to
      )
    }

    var parkingExpense
    if (req.body[ 'parking-charge' ]) {
      parkingExpense = new ParkingExpense(
        req.params.claimId,
        req.body[ 'parking-charge-cost' ],
        req.body.from,
        req.body.to
      )
    }

    insertCarExpenses(carExpense, tollExpense, parkingExpense)
      .then(function () {
        return res.redirect(expenseUrlRouter.getRedirectUrl(req))
      })
  })
}
