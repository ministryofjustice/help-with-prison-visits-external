const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')
const ERROR_MESSAGES = require('../validators/validation-error-messages')

class HasEscort {
  constructor(hasEscort) {
    this.hasEscort = hasEscort
    this.isValid()
  }

  isValid() {
    const errors = ErrorHandler()

    FieldValidator(this.hasEscort, 'has-escort', errors)
      .isRequired(ERROR_MESSAGES.getClaimingForEscort)
      .isValidBooleanSelect()

    const validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = HasEscort
