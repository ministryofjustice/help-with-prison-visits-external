const AlreadyRegistered = require('../services/domain/already-registered')
const ValidationError = require('../services/errors/validation-error')
const ERROR_MESSAGES = require('../services/validators/validation-error-messages')
const SessionHandler = require('../services/validators/session-handler')

module.exports = router => {
  router.get('/start-already-registered', (req, res) => {
    let errors

    req.session = SessionHandler.clearSession(req.session, req.url)

    if (req.query?.error === 'yes') {
      errors = { invalidReferenceNumberAndDob: [ERROR_MESSAGES.getInvalidReferenceNumberAndDob] }
    } else if (req.query?.error === 'expired') {
      errors = { expired: [ERROR_MESSAGES.getExpiredSession] }
    } else if (req.query?.error === 'disabled') {
      errors = { expired: [ERROR_MESSAGES.getReferenceDisabled] }
    }
    return res.render('start-already-registered', { errors, recovery: req.query?.recovery })
  })

  router.post('/start-already-registered', (req, res) => {
    const reference = req.body?.reference
    const day = req.body && req.body['dob-day']
    const month = req.body && req.body['dob-month']
    const year = req.body && req.body['dob-year']

    try {
      const alreadyRegistered = new AlreadyRegistered(reference, day, month, year)
      req.session.decryptedRef = reference
      req.session.dobEncoded = alreadyRegistered.dobEncoded

      return res.redirect('/your-claims')
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('start-already-registered', {
          claimType: req.params.claimType,
          dobDay: day,
          dobMonth: month,
          dobYear: year,
          reference,
          errors: error.validationErrors,
        })
      }
      throw error
    }
  })
}
