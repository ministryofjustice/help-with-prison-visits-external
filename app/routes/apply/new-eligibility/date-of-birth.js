const DateOfBirth = require('../../../services/domain/date-of-birth')
const ValidationError = require('../../../services/errors/validation-error')

module.exports = function (router) {
  router.get('/apply/:claimType/new-eligibility', function (req, res) {
    return res.render('apply/new-eligibility/date-of-birth', {
      claimType: req.params.claimType
    })
  })

  router.post('/apply/:claimType/new-eligibility', function (req, res) {
    try {
      var dateOfBirth = new DateOfBirth(
        req.body['dob-day'],
        req.body['dob-month'],
        req.body['dob-year']
      )

      if (dateOfBirth.sixteenOrUnder) {
        return res.redirect('/eligibility-fail')
      } else {
        return res.redirect(`/apply/${req.params.claimType}/new-eligibility/${dateOfBirth.getDobFormatted}`)
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('apply/new-eligibility/date-of-birth', {
          errors: error.validationErrors,
          claimType: req.params.claimType,
          claimant: req.body
        })
      }
    }
  })
}
