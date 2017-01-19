const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')

class Feedback {
  constructor (name, PhoneNumber, issue) {
    this.name = name
    this.PhoneNumber = PhoneNumber
    this.issue = issue
    this.isValid()
  }

  isValid () {
    var errors = ErrorHandler()

    FieldValidator(this.name, 'name', errors)
      .isRequired()
      .isRange(1, 200)

    FieldValidator(this.PhoneNumber, 'PhoneNumber', errors)
      .isRequired()
      .isRange(0, 20)

    FieldValidator(this.issue, 'issue', errors)
      .isRequired()
      .isLessThanLength(1200)

    var validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = Feedback
