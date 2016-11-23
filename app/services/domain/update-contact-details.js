const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')

class UpdateContactDetails {
  constructor (emailAddress, phoneNumber) {
    this.emailAddress = emailAddress
    this.phoneNumber = phoneNumber
    this.isValid()
  }

  isValid () {
    var errors = ErrorHandler()

    FieldValidator(this.emailAddress, 'EmailAddress', errors)
      .isRequired()
      .isRange(1, 100)
      .isEmail()

    FieldValidator(this.phoneNumber, 'PhoneNumber', errors)
      .isRange(0, 20)

    var validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = UpdateContactDetails
