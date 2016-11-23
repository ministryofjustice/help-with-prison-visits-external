const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')

class CheckYourInformation {
  constructor (confirmCorrect) {
    this.confirmCorrect = confirmCorrect
    this.isValid()
  }

  isValid () {
    var errors = ErrorHandler()

    FieldValidator(this.confirmCorrect, 'confirm-correct', errors)
      .isRequired()

    var validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = CheckYourInformation
