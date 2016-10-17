const FieldsetValidator = require('../fieldset-validator')
const dateFormatter = require('../../../services/date-formatter')

// TODO: Split the error construction logic out into its own class.
class DateOfBirthValidator {
  static validate (data) {
    var errors = {}

    var dobDay = data['dob-day']
    var dobMonth = data['dob-month']
    var dobYear = data['dob-year']

    var fields = [
      dobDay,
      dobMonth,
      dobYear
    ]

    var dob = dateFormatter.build(dobDay, dobMonth, dobYear)

    FieldsetValidator(fields, 'dob', errors)
      .isRequired()
      .isValidDate(dob)
      .isPastDate(dob)

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
