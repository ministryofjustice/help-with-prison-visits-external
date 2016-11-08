const UrlPathValidator = require('../../../../services/validators/url-path-validator')

module.exports = function (router) {
  router.get('/first-time/eligibility/:reference/claim/:claimId/child', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('first-time/eligibility/claim/about-child', {
      reference: req.params.reference,
      claimId: req.params.claimId
    })
  })

  router.post('/first-time/eligibility/:reference/claim/:claimId/child', function (req, res) {
    UrlPathValidator(req.params)

    // TODO: Build a domain object to hold the child details.
    // TODO: Persist the child details domain object.
    // TODO: Error handling based on validation.
    // TODO: Need to reload the page if the user selects add another child.

    return res.redirect(`/first-time/eligibility/${req.params.reference}/claim/${req.params.claimId}`)
  })
}
