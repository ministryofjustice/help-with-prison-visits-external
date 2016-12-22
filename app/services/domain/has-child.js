const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')

class HasChild {
  constructor (hasChild) {
    this.hasChild = hasChild
    this.isValid()
  }

  isValid () {
    var errors = ErrorHandler()

    FieldValidator(this.hasChild, 'has-child', errors)
      .isRequired('radio')
      .isValidBooleanSelect()

    var validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = HasChild
