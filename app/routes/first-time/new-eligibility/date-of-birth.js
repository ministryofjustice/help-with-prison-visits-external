const DateOfBirth = require('../../../services/domain/date-of-birth')
const ValidationError = require('../../../services/errors/validation-error')

module.exports = function (router) {
  router.get('/first-time/new-eligibility/', function (req, res) {
    return res.render('first-time/new-eligibility/date-of-birth')
  })

  router.post('/first-time/new-eligibility/', function (req, res) {
    try {
      var dateOfBirth = new DateOfBirth(req.body['dob-day'],
        req.body['dob-month'],
        req.body['dob-year'])

      if (dateOfBirth.sixteenOrUnder) {
        return res.redirect('/eligibility-fail')
      } else {
        return res.redirect(`/first-time/new-eligibility/${dateOfBirth.dobFormatted}`)
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('first-time/new-eligibility/date-of-birth', {
          claimant: req.body,
          errors: error.validationErrors
        })
      }
    }
  })
}
