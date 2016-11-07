const ExpensesValidator = require('../../../../services/validators/eligibility/expenses-validator')
const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const expenseUrlRouter = require('../../../../services/routing/expenses-url-router')

module.exports = function (router) {
  router.get('/first-time/eligibility/:reference/claim/:claimId', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('first-time/eligibility/claim/expenses', {
      reference: req.params.reference,
      claimId: req.params.claimId
    })
  })

  router.post('/first-time/eligibility/:reference/claim/:claimId', function (req, res) {
    UrlPathValidator(req.params)
    var validationErrors = ExpensesValidator(req.body)
    if (validationErrors) {
      return res.status(400).render('first-time/eligibility/claim/expenses', {
        errors: validationErrors,
        reference: req.params.reference,
        claimId: req.params.claimId
      })
    }
    return res.redirect(expenseUrlRouter.getRedirectUrl(req))
  })
}
