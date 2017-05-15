const AlreadyRegistered = require('../services/domain/already-registered')
const ValidationError = require('../services/errors/validation-error')
const ERROR_MESSAGES = require('../services/validators/validation-error-messages')

module.exports = function (router) {
  router.get('/start-already-registered', function (req, res) {
    var errors

    req.session.dobEncoded = null
    req.session.relationship = null
    req.session.benefit = null
    req.session.referenceId = null
    req.session.decryptedRef = null
    req.session.claimType = null
    req.session.advanceOrPast = null
    req.session.claimId = null
    req.session.advanceOrPast = null
    req.session.prisonerNumber = null

    if (req.query.error === 'yes') {
      errors = { invalidReferenceNumberAndDob: [ ERROR_MESSAGES.getInvalidReferenceNumberAndDob ] }
    } else if ((req.query.error === 'expired')) {
      errors = { expired: [ ERROR_MESSAGES.getExpiredSession ] }
    }
    return res.render('start-already-registered', { errors: errors, recovery: req.query.recovery })
  })

  router.post('/start-already-registered', function (req, res) {
    var reference = req.body.reference
    var day = req.body['dob-day']
    var month = req.body['dob-month']
    var year = req.body['dob-year']

    try {
      var alreadyRegistered = new AlreadyRegistered(reference, day, month, year)
      req.session.decryptedRef = reference
      req.session.dobEncoded = alreadyRegistered.dobEncoded

      return res.redirect(`/your-claims`)
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('start-already-registered', {
          claimType: req.params.claimType,
          dobDay: day,
          dobMonth: month,
          dobYear: year,
          reference: reference,
          errors: error.validationErrors
        })
      } else {
        throw error
      }
    }
  })
}
