var FieldValidator = require('../field-validator')

class DateOfBirthValidator {
  static validate (data) {
    var errors = {}

    // var dobDay = data['dob-day']
    // var dobMonth = data['dob-month']
    // var dobYear = data['dob-year']

    // FieldValidator(dobDay, 'dob-day', errors)
    //   .isRequired()
    //   .isNumeric()
    //   .isLength(2)
    //   .isValidDay()

    // FieldValidator(dobMonth, 'dob-month', errors)
    //   .isRequired()
    //   .isNumeric()
    //   .isLength(2)
    //   .isValidMonth()

    // FieldValidator(dobYear, 'dob-year', errors)
    //   .isRequired()
    //   .isNumeric()
    //   .isLength(4)
    //   .isValidYear()

    for (var field in errors) {
      if (errors.hasOwnProperty(field)) {
        if (errors[field].length > 0) { return errors }
      }
    }
    return false
  }
}
exports.default = function (data) {
  return DateOfBirthValidator.validate(data)
}
module.exports = exports['default']
