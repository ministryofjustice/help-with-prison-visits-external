const validator = require('./common-validator')
const ERROR_MESSAGES = require('./validation-error-messages')

class FieldValidator {

  /**
   * Build a validator for validating fields.
   * @param data A single element to validate.
   * @param fieldName The name of of the HTML element to link the error message to.
   * @param errors An instance of the ErrorHandler class.
   */
  constructor (data, fieldName, errors) {
    this.data = data
    this.fieldName = fieldName
    this.errors = errors
  }

  isRequired (questionType) {
    if (validator.isNullOrUndefined(this.data)) {
      if (questionType === 'radio') {
        this.errors.add(this.fieldName, ERROR_MESSAGES.getRadioQuestionIsRequired)
      } else {
        this.errors.add(this.fieldName, ERROR_MESSAGES.getIsRequired)
      }
    }
    return this
  }

  isAlpha () {
    if (!validator.isAlpha(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsAlpha)
    }
    return this
  }

  isNumeric () {
    if (!validator.isNumeric(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsNumeric)
    }
    return this
  }

  isLength (length) {
    if (!validator.isLength(this.data, length)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsLengthMessage, { length: length })
    }
    return this
  }
}

module.exports = function (data, fieldName, errors) {
  return new FieldValidator(data, fieldName, errors)
}
