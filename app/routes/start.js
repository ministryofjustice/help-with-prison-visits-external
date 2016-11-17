const AlreadyRegistered = require('../services/domain/already-registered')
const ValidationError = require('../services/errors/validation-error')
const ERROR_MESSAGES = require('../services/validators/validation-error-messages')
const claimTypeEnum = require('../constants/claim-type-enum')

module.exports = function (router) {
  router.get('/start', function (req, res) {
    if (req.query.error !== 'yes') {
      return res.render('start')
    }
    return res.render('start', {
      errors: { invalidReferenceNumberAndDob: [ ERROR_MESSAGES.getInvalidReferenceNumberAndDob ] }
    })
  })

  router.post('/start-first-time', function (req, res) {
    res.redirect(`/apply/${claimTypeEnum.FIRST_TIME}/new-eligibility`)
  })

  router.post('/start-already-registered', function (req, res) {
    var reference = req.body.reference
    var day = req.body['dob-day']
    var month = req.body['dob-month']
    var year = req.body['dob-year']

    try {
      var alreadyRegistered = new AlreadyRegistered(reference, day, month, year)
      return res.redirect(`/your-claims/${alreadyRegistered.getDobFormatted}/${reference}`)
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('start', {
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
