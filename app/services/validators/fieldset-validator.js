const validator = require('./common-validator')
const ERROR_MESSAGES = require('./validation-error-messages')

class FieldsetValidator {

  /**
   * Build a validator for validating fieldsets (I.e. a group of fields).
   * @param data An array of elements to validate as a set.
   * @param fieldName The name of of the HTML element to link the error message to.
   * @param errors An instance of the ErrorHandler class.
   */
  constructor (data, fieldName, errors) {
    this.data = data || []
    this.fieldName = fieldName
    this.errors = errors
  }

  isRequired () {
    var self = this
    if (this.data instanceof Array) {
      this.data.forEach(function (data) {
        if (validator.isNullOrUndefined(data)) {
          self.errors.add(self.fieldName, ERROR_MESSAGES.getIsRequired)
        }
      })
    }
    return this
  }

  isValidDate (date) {
    if (!validator.isDateValid(date)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getInvalidDobFormatMessage)
    }
    return this
  }

  isPastDate (date) {
    if (!validator.isDateInThePast(date)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getFutureDobMessage)
    }
    return this
  }

  isDateSetDaysAway (date, days) {
    if (!validator.isDateSetDaysAway(date, days)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getDateSetDaysAway, {days: days})
    }
    return this
  }
}

module.exports = function (data, fieldName, errors) {
  return new FieldsetValidator(data, fieldName, errors)
}
