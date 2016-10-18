const ERROR_MESSAGES = require('./validation-error-messages')

class FieldsetValidator {

  /**
   * Build a validator for validating fieldsets (I.e. a group of fields).
   * @param data An array of elements to validate as a set.
   * @param fieldName The name of of the HTML element to link the error message to.
   * @param errors An instance of the ErrorHandler class.
   */
  constructor (data, fieldName, errors) {
    this.data = data
    this.fieldName = fieldName
    this.errors = errors
  }

  isRequired () {
    var self = this
    this.data.forEach(function (data) {
      if (!data) {
        self.errors.add(self.fieldName, ERROR_MESSAGES.getIsRequired)
      }
    })
    return this
  }

  isValidDate (date) {
    if (!isDateValid(date)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getInvalidDobFormatMessage)
    }
    return this
  }

  isPastDate (date) {
    if (!isDateInThePast(date)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getFutureDobMessage)
    }
  }
}

module.exports = function (data, fieldName, errors) {
  return new FieldsetValidator(data, fieldName, errors)
}

function isDateValid (date) {
  return date.toString() !== 'Invalid Date'
}

function isDateInThePast (date) {
  return date <= new Date()
}
