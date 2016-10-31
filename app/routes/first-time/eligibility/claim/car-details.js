const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const ValidationError = require('../../../../services/errors/validation-error')
const expenseUrlRouter = require('../../../../services/routing/expenses-url-router')
const CarExpense = require('../../../../services/domain/expenses/car-expense')
const insertCarExpenses = require('../../../../services/data/insert-car-expenses')

module.exports = function (router) {
  // TODO: Replace the subbed 'to' and 'from' values with real values associated with this claim.
  router.get('/first-time-claim/eligibility/:reference/claim/:claimId/car', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('first-time/eligibility/claim/car-details', {
      reference: req.params.reference,
      claimId: req.params.claimId,
      params: expenseUrlRouter.parseParams(req.query),
      expense: {
        from: 'London',
        to: 'Hewell'
      }
    })
  })

  router.post('/first-time-claim/eligibility/:reference/claim/:claimId/car', function (req, res) {
    UrlPathValidator(req.params)

    try {
      var expense = new CarExpense(
        req.params.claimId,
        req.body.from,
        req.body.to,
        req.body.toll,
        req.body[ 'toll-cost' ],
        req.body[ 'parking-charge' ],
        req.body[ 'parking-charge-cost' ]
      )

      insertCarExpenses(expense)
        .then(function () {
          return res.redirect(expenseUrlRouter.getRedirectUrl(req))
        })
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('first-time/eligibility/claim/car-details', {
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
