const ERROR_MESSAGES = require('../services/validators/validation-error-messages')
const claimTypeEnum = require('../constants/claim-type-enum')
const SessionHandler = require('../services/validators/session-handler')

module.exports = function (router) {
  router.get('/start', function (req, res) {
    var errors

    req.session = SessionHandler.clearSession(req.session, req.url)

    if ((req.query.error === 'expired')) {
      errors = { expired: [ERROR_MESSAGES.getExpiredSession] }
    }

    return res.render('start', { errors: errors, recovery: req.query.recovery })
  })

  router.post('/start', function (req, res) {
    if (!req.body.madeClaimForPrisonerBefore) {
      var errors = { invalidReferenceNumberAndDob: [ERROR_MESSAGES.getMadeClaimForPrisonerBeforeIsRequired] }
      return res.status(400).render('start', { errors: errors })
    } else if (req.body.madeClaimForPrisonerBefore === 'yes') {
      return res.redirect('/start-already-registered')
    } else {
      return res.redirect(`/apply/${claimTypeEnum.FIRST_TIME}/new-eligibility/date-of-birth`)
    }
  })
}
