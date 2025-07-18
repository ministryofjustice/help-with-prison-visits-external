const ERROR_MESSAGES = require('../services/validators/validation-error-messages')
const claimTypeEnum = require('../constants/claim-type-enum')
const SessionHandler = require('../services/validators/session-handler')

module.exports = router => {
  router.get('/start', (req, res) => {
    let errors

    req.session = SessionHandler.clearSession(req.session, req.url)

    if (req.query?.error === 'expired') {
      errors = { expired: [ERROR_MESSAGES.getExpiredSession] }
    }

    return res.render('start', { errors, recovery: req.query?.recovery })
  })

  router.post('/start', (req, res) => {
    if (!req.body?.madeClaimForPrisonerBefore) {
      const errors = { madeClaimForPrisonerBefore: [ERROR_MESSAGES.getMadeClaimForPrisonerBeforeIsRequired] }
      return res.status(400).render('start', { errors })
    }
    if (req.body?.madeClaimForPrisonerBefore === 'yes') {
      return res.redirect('/start-already-registered')
    }
    return res.redirect(`/apply/${claimTypeEnum.FIRST_TIME}/new-eligibility/date-of-birth`)
  })
}
