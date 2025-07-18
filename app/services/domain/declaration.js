const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')
const ERROR_MESSAGES = require('../validators/validation-error-messages')

class Declaration {
  constructor(termsAndConiditions) {
    this.termsAndConiditions = termsAndConiditions
    this.IsValid()
  }

  IsValid() {
    const errors = ErrorHandler()

    FieldValidator(this.termsAndConiditions, 'terms-and-conditions', errors).isRequired(ERROR_MESSAGES.getDisclaimer)

    const validationErrors = errors.get()

    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = Declaration
