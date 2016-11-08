const UrlPathValidator = require('../../../../services/validators/url-path-validator')

// TODO: Add route unit test.
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
    // TODO: Add unit test for domain object.
    // TODO: Persist the child details domain object.
    // TODO: Add inegration test for peristance module.
    // TODO: Error handling based on validation.
    // TODO: Need to reload the page if the user selects add another child.
    // TODO: Update end-to-end test to hit the child page and add two children.

    return res.redirect(`/first-time/eligibility/${req.params.reference}/claim/${req.params.claimId}`)
  })
}
