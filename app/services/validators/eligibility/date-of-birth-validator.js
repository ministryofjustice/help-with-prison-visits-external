const FieldsetValidator = require('../fieldset-validator')
const ErrorHandler = require('../error-handler')
const dateFormatter = require('../../../services/date-formatter')

// TODO: Handle the data parameter being invalid.
class DateOfBirthValidator {
  static validate (data) {
    var errors = ErrorHandler()

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

    return errors.get()
  }
}

module.exports = function (data) {
  return DateOfBirthValidator.validate(data)
}
