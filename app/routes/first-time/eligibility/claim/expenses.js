const UrlPathValidator = require('../../../../services/validators/url-path-validator')

module.exports = function (router) {
  // TODO: We need to get each of selected checkboxes and build them into a list which we can then pass to the ExpenseUrlRouter
  router.get('/first-time-claim/eligibility/:reference/claim/:claim', function (req, res) {
    return res.render('first-time/eligibility/claim/expenses', {
      reference: req.params.reference,
      claim: req.params.claim
    })
  })

  // TODO: Add form validation.
  // TODO: Implement logic to determine real redirect location.
  router.post('/first-time-claim/eligibility/:reference/claim/:claim', function (req, res) {
    UrlPathValidator(req.params)
    return res.redirect('/car-details')
  })
}
