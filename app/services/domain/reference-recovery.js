const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')

class ReferenceRecovery {
  constructor(emailAddress, prisonerNumber) {
    this.EmailAddress = emailAddress ? emailAddress.trim() : ''
    this.PrisonerNumber = prisonerNumber ? prisonerNumber.replace(/ /g, '').toUpperCase() : ''
    this.isValid()
  }

  isValid() {
    const errors = ErrorHandler()

    FieldValidator(this.EmailAddress, 'EmailAddress', errors).isRequired().isRange(1, 100).isEmail()

    FieldValidator(this.PrisonerNumber, 'PrisonerNumber', errors).isRequired().isLessThanLength(10)

    const validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = ReferenceRecovery
