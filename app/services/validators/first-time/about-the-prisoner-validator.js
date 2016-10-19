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
    var prisonerNumber = data['prisonerNumber']
    var nameOfPrison = data['nameOfPrison']

    FieldValidator(firstName, 'firstName', errors)
      .isRequired()
      .isLessThanLength(100)

    FieldValidator(lastName, 'lastName', errors)
      .isRequired()
      .isLessThanLength(100)

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

    FieldValidator(prisonerNumber, 'prisonerNumber', errors)
      .isRequired()
      .isLessThanLength(10)

    FieldValidator(nameOfPrison, 'nameOfPrison', errors)
      .isRequired()
      .isLessThanLength(100)

    return errors.get()
  }
}
module.exports = function (data) {
  return AboutThePrisonerValidator.validate(data)
}
