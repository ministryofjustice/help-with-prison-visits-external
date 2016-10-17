const FieldsetValidator = require('../fieldset-validator')

// TODO: Split the error construction logic out into its own class.
class DateOfBirthValidator {
  static validate (data) {
    var errors = {}

    var dobDay = data['dob-day']
    var dobMonth = data['dob-month']
    var dobYear = data['dob-year']

    var dob = [
      dobDay,
      dobMonth,
      dobYear
    ]

    var date = new Date(buildDOB(dobYear, dobMonth, dobDay))

    FieldsetValidator(dob, 'dob', errors)
      .isRequired()
      .isValidDate(date)
      .isPastDate(date)

    for (var field in errors) {
      if (errors.hasOwnProperty(field)) {
        if (errors[ field ].length > 0) { return errors }
      }
    }
    return false
  }
}

module.exports = function (data) {
  return DateOfBirthValidator.validate(data)
}

// TODO: This should be used by both the validator and the date-of-birth routes.
function buildDOB (year, month, day) {
  return new Date(year + '-' + month + '-' + day)
}
