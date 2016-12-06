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
    if (!validator.isValidDate(date)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getInvalidDateFormatMessage)
    }
    return this
  }

  isValidDateOfBirth (date) {
    if (!validator.isValidDateOfBirth(date)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getInvalidDateFormatMessage)
    }
    return this
  }

  isPastDate (date) {
    if (!validator.isDateInThePast(date)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getPastDateMessage)
    }
    return this
  }

  isFutureDate (date) {
    if (!validator.isDateInTheFuture(date)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getFutureDateMessage)
    }
    return this
  }

  isDateWithinDays (date, days) {
    if (!validator.isDateWithinDays(date, days)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getDateSetDaysAway, { days: days })
    }
    return this
  }

  isNotDateWithinDays (date, days) {
    if (validator.isDateWithinDays(date, days)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getNotDateSetDaysAway, { days: days })
    }
    return this
  }

  isYoungerThanInYears (dob, years) {
    if (validator.isOlderThanInYears(dob, years)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsYoungerThan, { years: years })
    }
    return this
  }

  isOlderThanInYears (dob, years) {
    if (!validator.isOlderThanInYears(dob, years)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsOlderThan, { years: years })
    }
    return this
  }
}

module.exports = function (data, fieldName, errors) {
  return new FieldsetValidator(data, fieldName, errors)
}
