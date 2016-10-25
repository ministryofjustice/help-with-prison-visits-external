const UrlPathValidator = require('../../../../services/validators/url-path-validator')

module.exports = function (router) {
  router.get('/first-time-claim/eligibility/:reference/new-claim/past', function (req, res) {
    return res.render('first-time/eligibility/new-claim/journey-information', {
      reference: req.params.reference
    })
  })

  // TODO: Add form validation.
  // TODO: Add branches based on question responses.
  // TODO: Persist date of prison visit.
  // TODO: Need to generate real Claim ID at this point.
  router.post('/first-time-claim/eligibility/:reference/new-claim/past', function (req, res) {
    UrlPathValidator(req.params)
    var stubId = '123'
    return res.redirect(`/first-time-claim/eligibility/${req.params.reference}/claim/${stubId}`)
  })
}
