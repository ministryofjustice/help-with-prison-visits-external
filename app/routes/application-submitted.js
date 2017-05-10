const UrlPathValidator = require('../services/validators/url-path-validator')

module.exports = function (router) {
  router.get('/application-submitted', function (req, res) {
    UrlPathValidator(req.params)
    var decryptedRef = req.session.decryptedRef
    var advanceOrPast = req.session.advanceOrPast

    clearSessionCookieOnSubmission(req)

    return res.render('application-submitted', {
      reference: decryptedRef,
      advanceOrPast: advanceOrPast
    })
  })

  function clearSessionCookieOnSubmission (req) {
    if (req.session) {
      req.session.dobEncoded = null
      req.session.relationship = null
      req.session.benefit = null
      req.session.referenceId = null
      req.session.decryptedRef = null
      req.session.claimType = null
      req.session.advanceOrPast = null
      req.session.claimId = null
      req.session.advanceOrPast = null
    }
  }
}
