const FieldValidator = require('../field-validator')
const FieldsetValidator = require('../fieldset-validator')
const dateFormatter = require('../../../services/date-formatter')
const ErrorHandler = require('../error-handler')

class AboutThePrisonerValidator {
  static validate (data) {
    var errors = ErrorHandler()

    var firstName = data['FirstName']
    var lastName = data['LastName']
    var dobDay = data['dob-day']
    var dobMonth = data['dob-month']
    var dobYear = data['dob-year']
    var prisonerNumber = data['PrisonerNumber']
    var nameOfPrison = data['NameOfPrison']

    FieldValidator(firstName, 'FirstName', errors)
      .isRequired()
      .isLessThanLength(100)

    FieldValidator(lastName, 'LastName', errors)
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

    FieldValidator(prisonerNumber, 'PrisonerNumber', errors)
      .isRequired()
      .isLessThanLength(10)

    FieldValidator(nameOfPrison, 'NameOfPrison', errors)
      .isRequired()
      .isLessThanLength(100)

    return errors.get()
  }
}
module.exports = function (data) {
  return AboutThePrisonerValidator.validate(data)
}
