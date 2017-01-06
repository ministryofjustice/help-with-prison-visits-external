const AlreadyRegistered = require('../services/domain/already-registered')
const ValidationError = require('../services/errors/validation-error')
const ERROR_MESSAGES = require('../services/validators/validation-error-messages')
const encrypt = require('../services/helpers/encrypt')

module.exports = function (router) {
  router.get('/start-already-registered', function (req, res) {
    var errors
    if (req.query.error === 'yes') {
      errors = { invalidReferenceNumberAndDob: [ ERROR_MESSAGES.getInvalidReferenceNumberAndDob ] }
    }
    return res.render('start-already-registered', { errors: errors })
  })

  router.post('/start-already-registered', function (req, res) {
    var reference = req.body.reference
    var day = req.body['dob-day']
    var month = req.body['dob-month']
    var year = req.body['dob-year']

    try {
      var alreadyRegistered = new AlreadyRegistered(reference, day, month, year)
      var encryptedRef = encrypt(reference)
      return res.redirect(`/your-claims/${alreadyRegistered.getDobFormatted}/${encryptedRef}`)
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
