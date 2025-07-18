const UrlPathValidator = require('../services/validators/url-path-validator')
const SessionHandler = require('../services/validators/session-handler')
const log = require('../services/log')

module.exports = router => {
  router.get('/application-submitted', (req, res) => {
    UrlPathValidator(req.params)
    const { decryptedRef } = req.session
    const { advanceOrPast } = req.session
    log.info(`ClaimID ${req.session.claimId} Submitted`)
    req.session = SessionHandler.clearSession(req.session, req.url)

    return res.render('application-submitted', {
      reference: decryptedRef,
      advanceOrPast,
    })
  })
}
