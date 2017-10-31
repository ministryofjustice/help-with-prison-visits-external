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

  isRequired (specificMessage) {
    var message = (!specificMessage) ? ERROR_MESSAGES.getIsRequired : specificMessage
    var self = this
    if (this.data instanceof Array) {
      this.data.forEach(function (data) {
        if (validator.isNullOrUndefined(data)) {
          self.errors.add(self.fieldName, message)
        }
      })
    }
    return this
  }

  isEmptyOrValidDate (date) {
    if (!validator.isNullOrUndefined(date) && !validator.isValidDate(date)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getInvalidDateFormatMessage)
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

  isDateWithinDays (date, days, isAdvanceClaim) {
    if (!validator.isDateWithinDays(date, days)) {
      var message = isAdvanceClaim ? ERROR_MESSAGES.getFutureDateSetDaysAway : ERROR_MESSAGES.getPastDateSetDaysAway
      this.errors.add(this.fieldName, message, { days: days })
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
