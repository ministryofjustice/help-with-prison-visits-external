const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')

class UpdatedContactDetails {
  constructor(emailAddress, phoneNumber) {
    this.emailAddress = emailAddress ? emailAddress.trim() : ''
    this.phoneNumber = phoneNumber ? phoneNumber.trim() : ''
    this.isValid()
  }

  isValid() {
    const errors = ErrorHandler()

    FieldValidator(this.emailAddress, 'EmailAddress', errors).isRequired().isRange(1, 100).isEmail()

    FieldValidator(this.phoneNumber, 'PhoneNumber', errors).isRange(0, 20)

    const validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = UpdatedContactDetails
