const AlreadyRegistered = require('../services/domain/already-registered')
const ValidationError = require('../services/errors/validation-error')

module.exports = function (router) {
  router.get('/start', function (req, res) {
    return res.render('start')
  })

  router.post('/start', function (req, res) {
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
