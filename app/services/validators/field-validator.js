const validator = require('./common-validator')
const ERROR_MESSAGES = require('./validation-error-messages')
const config = require('../../../config')

class FieldValidator {
  /**
   * Build a validator for validating fields.
   * @param data A single element to validate.
   * @param fieldName The name of of the HTML element to link the error message to.
   * @param errors An instance of the ErrorHandler class.
   */
  constructor(data, fieldName, errors) {
    this.data = data
    this.fieldName = fieldName
    this.errors = errors
  }

  isRequired(specificMessage) {
    const message = !specificMessage ? ERROR_MESSAGES.getIsRequired : specificMessage
    if (validator.isNullOrUndefined(this.data)) {
      this.errors.add(this.fieldName, message)
    } else if (this.data === 'select') {
      this.errors.add(this.fieldName, message)
    }
    return this
  }

  isAlpha() {
    if (!validator.isAlpha(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsAlpha)
    }
    return this
  }

  isNumeric() {
    if (!validator.isNumeric(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsNumeric)
    }
    return this
  }

  isCurrency() {
    if (!validator.isCurrency(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsCurrency)
    }
    return this
  }

  isGreaterThanZero() {
    if (!validator.isGreaterThanZero(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsGreaterThan)
    }
    return this
  }

  isRange(min, max) {
    if (!validator.isRange(this.data, min, max)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsRangeMessage, { min, max })
    }
    return this
  }

  isLength(length, specificMessage) {
    const message = !specificMessage ? ERROR_MESSAGES.getIsLengthMessage : specificMessage
    if (!validator.isLength(this.data, length)) {
      this.errors.add(this.fieldName, message, { length })
    }
    return this
  }

  isLessThanLength(length, specificMessage) {
    const message = !specificMessage ? ERROR_MESSAGES.getIsPhoneNumberLessThanLengthMessage : specificMessage
    if (!validator.isLessThanLength(this.data, length)) {
      this.errors.add(this.fieldName, message, { length })
    }
    return this
  }

  isNationalInsuranceNumber() {
    if (!validator.isNationalInsuranceNumber(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsValidFormat)
    }
    return this
  }

  isPostcode() {
    if (!validator.isPostcode(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsValidFormat)
    }
    return this
  }

  isEmail() {
    if (!validator.isEmail(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsValidFormat)
    }
    return this
  }

  isInteger() {
    if (!validator.isInteger(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsIntegerFormat)
    }
    return this
  }

  isMaxIntOrLess() {
    if (!validator.isMaxIntOrLess(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getValueIsTooLarge)
    }
  }

  isMaxCostOrLess() {
    if (!validator.isMaxCostOrLess(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getCostIsTooLarge, { cost: parseFloat(config.MAX_COST) })
    }
  }

  isReference() {
    if (!validator.isValidReference(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsValidReference)
    }
    return this
  }

  isEmptyOrReference() {
    if (!validator.isNullOrUndefined(this.data) && !validator.isValidReference(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsValidReference)
    }
    return this
  }

  isValidChildRelationship() {
    if (!validator.isValidChildRelationship(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsValidOption)
    }
    return this
  }

  isValidBooleanSelect() {
    if (!validator.isValidBooleanSelect(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsValidOption)
    }
    return this
  }

  isValidPrisonerRelationship() {
    if (!validator.isValidPrisonerRelationship(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsValidOption)
    }
    return this
  }

  isValidBenefit(fromDomain) {
    if (fromDomain && this.data === 'none') {
      return this
    }
    if (!validator.isValidBenefit(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsValidOption)
    }
    return this
  }

  isValidExpenseArray() {
    if (!validator.isValidExpenseArray(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsValidOption)
    }
    return this
  }

  isValidAdvanceOrPast() {
    if (!validator.isValidAdvanceOrPast(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getIsValidOption)
    }
    return this
  }

  isValidRollNumber() {
    if (!validator.isValidRollNumber(this.data)) {
      this.errors.add(this.fieldName, ERROR_MESSAGES.getRollNumberValidFormatMessage)
    }
    return this
  }
}

module.exports = (data, fieldName, errors) => {
  return new FieldValidator(data, fieldName, errors)
}
