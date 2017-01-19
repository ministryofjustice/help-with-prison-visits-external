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
    } else if (this.data === 'select') {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getDropboxIsRequired)
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

  isCurrency () {
    if (!validator.isCurrency(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsCurrency)
    }
    return this
  }

  isGreaterThanZero () {
    if (!validator.isGreaterThanZero(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsGreaterThan)
    }
    return this
  }

  isRange (min, max) {
    if (!validator.isRange(this.data, min, max)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsRangeMessage, { min: min, max: max })
    }
    return this
  }

  isLength (length) {
    if (!validator.isLength(this.data, length)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsLengthMessage, { length: length })
    }
    return this
  }

  isLessThanLength (length) {
    if (!validator.isLessThanLength(this.data, length)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsLessThanLengthMessage, { length: length })
    }
    return this
  }

  isNationalInsuranceNumber () {
    if (!validator.isNationalInsuranceNumber(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsValidFormat)
    }
    return this
  }

  isPostcode () {
    if (!validator.isPostcode(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsValidFormat)
    }
    return this
  }

  isEmail () {
    if (!validator.isEmail(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsValidFormat)
    }
    return this
  }

  isReference () {
    if (!validator.isValidReference(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsValidFormat)
    }
    return this
  }

  isValidChildRelationship () {
    if (!validator.isValidChildRelationship(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsValidOption)
    }
    return this
  }

  isValidBooleanSelect () {
    if (!validator.isValidBooleanSelect(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsValidOption)
    }
    return this
  }

  isValidPrisonerRelationship () {
    if (!validator.isValidPrisonerRelationship(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsValidOption)
    }
    return this
  }

  isValidBenefit (fromDomain) {
    if (fromDomain && this.data === 'none') {
      return this
    }
    if (!validator.isValidBenefit(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsValidOption)
    }
    return this
  }

  isValidExpenseArray () {
    if (!validator.isValidExpenseArray(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsValidOption)
    }
    return this
  }

  isValidAdvanceOrPast () {
    if (!validator.isValidAdvanceOrPast(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsValidOption)
    }
    return this
  }
}

module.exports = function (data, fieldName, errors) {
  return new FieldValidator(data, fieldName, errors)
}
