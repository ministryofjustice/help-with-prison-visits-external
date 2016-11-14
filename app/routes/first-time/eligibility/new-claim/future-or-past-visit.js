const UrlPathValidator = require('../../../../services/validators/url-path-validator')

module.exports = function (router) {
  router.get('/first-time/eligibility/:referenceId/new-claim', function (req, res) {
    UrlPathValidator(req.params)

    return res.render('first-time/eligibility/new-claim/future-or-past-visit', {
      referenceId: req.params.referenceId
    })
  })

  router.post('/first-time/eligibility/:referenceId/new-claim', function (req, res) {
    UrlPathValidator(req.params)

    return res.redirect(`/first-time/eligibility/${req.params.referenceId}/new-claim/past`)
  })
}
