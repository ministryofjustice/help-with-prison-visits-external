const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const expenseUrlRouter = require('../../../../services/routing/expenses-url-router')

module.exports = function (router) {
  // TODO: Replace the subbed 'to' and 'from' values with real values associated with this claim.
  router.get('/first-time-claim/eligibility/:reference/claim/:claim/car', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('first-time/eligibility/claim/car-details', {
      reference: req.params.reference,
      claim: req.params.claim,
      params: expenseUrlRouter.parseParams(req.query),
      from: 'London',
      to: 'Hewell'
    })
  })

  // TODO: Add form validation.
  router.post('/first-time-claim/eligibility/:reference/claim/:claim/car', function (req, res) {
    UrlPathValidator(req.params)
    return res.redirect(expenseUrlRouter.getRedirectUrl(req))
  })
}
