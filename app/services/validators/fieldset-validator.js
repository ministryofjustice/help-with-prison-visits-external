const FIELD_NAMES = require('./validation-field-names')
const ERROR_MESSAGES = require('./validation-error-messages')

// TODO: Factor out the error construction logic
class FieldSetValidator {

  /**
   * Build a validator for validation fieldsets.
   * @param data An array of elements to validate as a set.
   * @param fieldName The name of of the field on the HTML page to
   * @param errors An object that each validation error will be appended to.
   */
  constructor (data, fieldName, errors) {
    this.data = data
    this.fieldName = fieldName
    this.displayName = FIELD_NAMES[fieldName]
    this.errors = errors
    this.errors[fieldName] = []
  }

  isRequired () {
    var self = this

    this.data.forEach(function(data) {
      if (!data) {
        self.addErrorMessage(ERROR_MESSAGES.getIsRequired)
      }
    })
    return this
  }

  isValidDate (date) {
    if (!isDateValid(date)) {
      this.addErrorMessage(ERROR_MESSAGES.getInvalidDobFormatMessage)
    }
    return this
  }

  isPastDate(date) {
    if (!isDateInThePast(date)) {
      this.addErrorMessage(ERROR_MESSAGES.getFutureDobMessage)
    }
  }

  isFutureDate(date) {
    if (!this.isDateInTheFuture(date)) {
      this.addErrorMessage(ERROR_MESSAGES.getPastDobMessage)
    }
  }

  addErrorMessage (message, options) {
    this.errors[this.fieldName].push(message(this.displayName, options))
  }
}

module.exports = function (data, fieldName, errors) {
  return new FieldSetValidator(data, fieldName, errors)
}

function isDateValid (date) {
  return date.toString() !== 'Invalid Date'
}

function isDateInThePast (date) {
  return date <= new Date()
}

function isDateInTheFuture (date) {
  return date => new Date()
}
