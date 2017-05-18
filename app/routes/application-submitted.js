const UrlPathValidator = require('../services/validators/url-path-validator')
const SessionHandler = require('../services/validators/session-handler')

module.exports = function (router) {
  router.get('/application-submitted', function (req, res) {
    UrlPathValidator(req.params)
    var decryptedRef = req.session.decryptedRef
    var advanceOrPast = req.session.advanceOrPast

    req.session = SessionHandler.clearSession(req.session, req.url)

    return res.render('application-submitted', {
      reference: decryptedRef,
      advanceOrPast: advanceOrPast
    })
  })
}
