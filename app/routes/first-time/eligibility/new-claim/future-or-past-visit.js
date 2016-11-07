const UrlPathValidator = require('../../../../services/validators/url-path-validator')

module.exports = function (router) {
  router.get('/first-time/eligibility/:reference/new-claim', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('first-time/eligibility/new-claim/future-or-past-visit', {
      reference: req.params.reference
    })
  })

  router.post('/first-time/eligibility/:reference/new-claim', function (req, res) {
    UrlPathValidator(req.params)
    return res.redirect(`/first-time/eligibility/${req.params.reference}/new-claim/past`)
  })
}
