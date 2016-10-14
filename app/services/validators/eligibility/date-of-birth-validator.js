const FIELD_NAMES = require('../validation-field-names')
const ERROR_MESSAGES = require('../validation-error-messages')

// TODO: Split the error construction logic out into its own class.
class DateOfBirthValidator {
  static validate (data) {
    var errors = {}

    var dobDay = data['dob-day']
    var dobMonth = data['dob-month']
    var dobYear = data['dob-year']

    if (!dobDay || !dobMonth || !dobYear) {
      addErrorMessage(errors, 'dob', 'dob', ERROR_MESSAGES.getInvalidDobFormatMessage)
    } else {
      var dob = new Date(buildDOB(dobYear, dobMonth, dobDay))

      if (!isValidDate(dob)) {
        addErrorMessage(errors, 'dob', 'dob', ERROR_MESSAGES.getInvalidDobFormatMessage)
      }

      if (!isDateInThePast(dob)) {
        addErrorMessage(errors, 'dob', 'dob', ERROR_MESSAGES.getFutureDobMessage)
      }
    }

    for (var field in errors) {
      if (errors.hasOwnProperty(field)) {
        if (errors[ field ].length > 0) { return errors }
      }
    }
    return false
  }
}

exports.default = function (data) {
  return DateOfBirthValidator.validate(data)
}
module.exports = exports[ 'default' ]

function buildDOB (year, month, day) {
  return new Date(year + '-' + month + '-' + day)
}

function isValidDate (date) {
  return date.toString() !== 'Invalid Date'
}

function isDateInThePast (date) {
  return date <= new Date()
}

// TODO: This function should be moved to a generic class for handling higher level validation. I.e. Not on a field.
function addErrorMessage (errors, fieldName, displayName, message, options) {
  if (!errors[fieldName]) {
    errors[fieldName] = []
  }
  displayName = FIELD_NAMES[fieldName]
  errors[fieldName].push(message(displayName, options))
}
