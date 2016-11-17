const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')

class Benefits {
  constructor (benefit) {
    this.benefit = benefit ? benefit.trim() : ''
    this.isValid()
  }

  isValid () {
    var errors = ErrorHandler()

    FieldValidator(this.benefit, 'benefit', errors)
      .isRequired('radio')
      .isValidBenefit()

    var validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = Benefits
