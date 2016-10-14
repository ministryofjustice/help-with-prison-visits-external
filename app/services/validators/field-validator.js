var validator = require('validator')
const FIELD_NAMES = require('./validation-field-names')
const ERROR_MESSAGES = require('./validation-error-messages')

const MIN_DAY = 1
const MAX_DAY = 31
const MIN_MONTH = 1
const MAX_MONTH = 12
const MIN_YEAR = 0

// ES6 Class used to chain common validation calls together
// Using ES6 Template literals
class FieldValidator {
  constructor (data, fieldName, errors) {
    this.data = data
    this.fieldName = fieldName
    this.displayName = FIELD_NAMES[fieldName]
    this.errors = errors

    this.errors[fieldName] = []
  }

  isRequired () {
    if (!this.data) {
      this.addErrorMessage(ERROR_MESSAGES.getIsRequired)
    }
    return this
  }

  isAlpha () {
    if (!validator.isAlpha(this.data)) {
      this.addErrorMessage(ERROR_MESSAGES.getIsAlpha)
    }
    return this
  }

  isNumeric () {
    if (!validator.isNumeric(this.data)) {
      this.addErrorMessage(ERROR_MESSAGES.getIsNumeric)
    }
    return this
  }

  isLength (length) {
    if (!validator.isLength(this.data, {min: length, max: length})) {
      this.addErrorMessage(ERROR_MESSAGES.getIsLengthMessage)
    }
    return this
  }

  isValidDay () {
    if (!inRange(this.data, MIN_DAY, MAX_DAY)) {
      this.addErrorMessage(ERROR_MESSAGES.getIsValidDayMessage)
    }
    return this
  }

  isValidMonth () {
    if (!inRange(this.data, MIN_MONTH, MAX_MONTH)) {
      this.addErrorMessage(ERROR_MESSAGES.getIsValidMonthMessage)
    }
    return this
  }

  isValidYear () {
    if (!inRange(this.data, MIN_YEAR, undefined)) {
      this.addErrorMessage(ERROR_MESSAGES.getIsValidYearMessage)
    }
    return this
  }

  addErrorMessage (getMessage) {
    this.errors[this.fieldName].push(getMessage(this.displayName))
  }
}

exports.default = function (data, fieldName, errors) {
  return new FieldValidator(data, fieldName, errors)
}

module.exports = exports['default']

function inRange (value, min, max) {
  return value >= min && value <= max
}
