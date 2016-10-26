const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const expenseUrlRouter = require('../../../../services/routing/expenses-url-router')

module.exports = function (router) {
  router.get('/first-time-claim/eligibility/:reference/claim/:claim/plane', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('first-time/eligibility/claim/plane-details', {
      reference: req.params.reference,
      claim: req.params.claim,
      params: expenseUrlRouter.parseParams(req.query)
    })
  })

  // TODO: Add form validation.
  router.post('/first-time-claim/eligibility/:reference/claim/:claim/plane', function (req, res) {
    UrlPathValidator(req.params)
    return res.redirect(expenseUrlRouter.getRedirectUrl(req))
  })
}
