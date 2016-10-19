const FieldValidator = require('../field-validator')
const FieldsetValidator = require('../fieldset-validator')
const dateFormatter = require('../../../services/date-formatter')
const ErrorHandler = require('../error-handler')

class AboutThePrisonerValidator {
  static validate (data) {
    var errors = ErrorHandler()

    var firstName = data['firstName']
    var lastName = data['lastName']
    var dobDay = data['dob-day']
    var dobMonth = data['dob-month']
    var dobYear = data['dob-year']
    var prisonNumber = data['prisonNumber']
    var nameOfPrison = data['nameOfPrison']

    var dobFields = [
      dobDay,
      dobMonth,
      dobYear
    ]

    var dob = dateFormatter.build(dobDay, dobMonth, dobYear)

    FieldsetValidator(dobFields, 'dob', errors)
      .isRequired()
      .isValidDate(dob)
      .isPastDate(dob)

    for (var field in errors) {
      if (errors.hasOwnProperty(field)) {
        if (errors[field].length > 0) { return errors }
      }
    }
    return false
  }
}
module.exports = function (data) {
  return AboutThePrisonerValidator.validate(data)
}
