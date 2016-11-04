const DateOfBirthValidator = require('../../../services/validators/eligibility/date-of-birth-validator')
const dateFormatter = require('../../../services/date-formatter')
const moment = require('moment')

module.exports = function (router) {
  router.get('/first-time', function (req, res) {
    return res.render('first-time/new-eligibility/date-of-birth')
  })

  router.post('/first-time', function (req, res) {
    var validationErrors = DateOfBirthValidator(req.body)

    if (validationErrors) {
      return res.status(400).render('first-time/new-eligibility/date-of-birth', {
        claimant: req.body,
        errors: validationErrors })
    }

    var dobAsDateAndFormattedString = parseDobAsDateAndFormattedString(req)

    if (isSixteenOrUnder(dobAsDateAndFormattedString.date)) {
      return res.redirect('/eligibility-fail')
    } else {
      return res.redirect(`/first-time/${dobAsDateAndFormattedString.formattedString}`)
    }
  })
}

function parseDobAsDateAndFormattedString (req) {
  var day = req.body['dob-day']
  var month = req.body['dob-month']
  var year = req.body['dob-year']
  return {
    date: dateFormatter.build(day, month, year),
    formattedString: dateFormatter.buildFormatted(day, month, year)
  }
}

function isSixteenOrUnder (dobDate) {
  const AGE_MUST_BE_OVER = 16
  const CURRENT_YEAR = moment().year()
  if ((dobDate.year() + AGE_MUST_BE_OVER) >= CURRENT_YEAR) {
    return true
  }
  return false
}
