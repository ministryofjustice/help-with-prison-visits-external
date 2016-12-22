const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')

class HasEscort {
  constructor (hasEscort) {
    this.hasEscort = hasEscort
    this.isValid()
  }

  isValid () {
    var errors = ErrorHandler()

    FieldValidator(this.hasEscort, 'has-escort', errors)
      .isRequired('radio')
      .isValidBooleanSelect()

    var validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = HasEscort
