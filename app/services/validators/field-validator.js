const validator = require('validator')
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
    if (!this.data) {
      if (questionType === 'radio') {
        this.errors.add(this.fieldName, ERROR_MESSAGES.getRadioQuestionIsRequired)
      } else if (questionType === 'journeyAssistance') {
        this.errors.add(this.fieldName, ERROR_MESSAGES.getJourneyAssistanceIsRequired)
      } else if (questionType === 'dropbox') {
        this.errors.add(this.fieldName, ERROR_MESSAGES.getDropboxIsRequired)
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

  isRange (min, max) {
    if (!validator.isLength(this.data, {min: min, max: max})) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsRangeMessage, { min: min, max: max })
    }
    return this
  }

  isNationalInsuranceNumber () {
    if (!validator.matches(this.data, '^[A-z]{2}[0-9]{6}[A-z]{1}$')) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsNationalInsuranceNumber)
    }
    return this
  }

  isPostcode () {
    if (!validator.matches(this.data, '^[A-Z]{1,2}[0-9]{1,2}[A-Z]?[0-9]{1}[A-Z]{2}$')) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsPostcode)
    }
    return this
  }

  isLength (length) {
    if (!validator.isLength(this.data, {min: length, max: length})) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsLengthMessage, { length: length })
    }
    return this
  }
}

module.exports = function (data, fieldName, errors) {
  return new FieldValidator(data, fieldName, errors)
}
