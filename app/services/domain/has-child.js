const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')
const ERROR_MESSAGES = require('../validators/validation-error-messages')

class HasChild {
  constructor(hasChild) {
    this.hasChild = hasChild
    this.isValid()
  }

  isValid() {
    const errors = ErrorHandler()

    FieldValidator(this.hasChild, 'has-child', errors)
      .isRequired(ERROR_MESSAGES.getClaimingForChild)
      .isValidBooleanSelect()

    const validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = HasChild
