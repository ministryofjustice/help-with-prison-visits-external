const DateOfBirthValidator = require('../../services/validators/eligibility/date-of-birth-validator')
const dateFormatter = require('../../services/date-formatter')

module.exports = function (router) {
  router.get('/first-time', function (req, res, next) {
    res.render('first-time/date-of-birth')
    next()
  })

  router.post('/first-time', function (req, res, next) {
    var validationErrors = DateOfBirthValidator(req.body)

    if (validationErrors) {
      res.status(400).render('first-time/date-of-birth', { claimant: req.body, errors: validationErrors })
      return next()
    }

    // TODO: Need age check here. If under 16 redirect to eligibility-fail + unit test.

    res.redirect('/first-time/' + buildDOB(req))
    next()
  })
}

function buildDOB (req) {
  var day = req.body['dob-day']
  var month = req.body['dob-month']
  var year = req.body['dob-year']
  return dateFormatter.buildFormatted(day, month, year)
}
