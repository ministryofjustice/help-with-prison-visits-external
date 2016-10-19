const validator = require('validator')
const FIELD_NAMES = require('./validation-field-names')
const ERROR_MESSAGES = require('./validation-error-messages')

// TODO: Incorporate ErrorHandler replacing exisitng error specific logic in this class.
// TODO: Add unit test for this clas.

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

  isRequired (questionType = 'field') {
    if (!this.data) {
      if (questionType === 'radio') {
        this.addErrorMessage(ERROR_MESSAGES.getRadioQuestionIsRequired)
      } else if (questionType === 'journeyAssistance') {
        this.addErrorMessage(ERROR_MESSAGES.getJourneyAssistanceIsRequired)
      } else if (questionType === 'dropbox') {
        this.addErrorMessage(ERROR_MESSAGES.getDropboxIsRequired)
      } else {
        this.addErrorMessage(ERROR_MESSAGES.getIsRequired)
      }
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

  isLength (min, max) {
    if (!validator.isLength(this.data, {min: min, max: max})) {
      this.addErrorMessage(ERROR_MESSAGES.getIsBetweenMessage, { min: min, max: max })
    }
    return this
  }

  isNationalInsuranceNumber () {
    if (!validator.matches(this.data, '^[A-z]{2}[0-9]{6}[A-z]{1}$')) {
      this.addErrorMessage(ERROR_MESSAGES.getIsNationalInsuranceNumber)
    }
    return this
  }

  isPostcode () {
    if (!validator.matches(this.data, '^[A-Z]{1,2}[0-9]{1,2}[A-Z]?[0-9]{1}[A-Z]{2}$')) {
      this.addErrorMessage(ERROR_MESSAGES.getIsPostcode)
    }
    return this
  }

  addErrorMessage (message, options) {
    this.errors[this.fieldName].push(message(this.displayName, options))
  }
}

exports.default = function (data, fieldName, errors) {
  return new FieldValidator(data, fieldName, errors)
}

module.exports = exports['default']
