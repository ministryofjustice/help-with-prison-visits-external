const UrlPathValidator = require('../../../../services/validators/url-path-validator')

module.exports = function (router) {
  router.get('/first-time/eligibility/:reference/claim/:claimId/file-upload', function (req, res) {
    UrlPathValidator(req.params)
    res.render('first-time/eligibility/claim/file-upload', {})
  })
}
