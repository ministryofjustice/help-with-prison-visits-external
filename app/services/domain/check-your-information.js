const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')

class CheckYourInformation {
  constructor (confirmCorrect) {
    this.confirmCorrect = confirmCorrect
    this.isValid()
  }

  isValid () {
    const errors = ErrorHandler()

    FieldValidator(this.confirmCorrect, 'confirm-correct', errors)
      .isRequired()

    const validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = CheckYourInformation
