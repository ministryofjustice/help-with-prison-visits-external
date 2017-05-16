const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')
const ERROR_MESSAGES = require('../validators/validation-error-messages')

class Feedback {
  constructor (name, emailAddress, issue) {
    this.name = name ? name.trim() : ''
    this.emailAddress = emailAddress ? emailAddress.trim() : ''
    this.issue = issue
    this.isValid()
  }

  isValid () {
    var errors = ErrorHandler()

    FieldValidator(this.name, 'name', errors)
      .isRequired()
      .isRange(1, 200)

    FieldValidator(this.emailAddress, 'EmailAddress', errors)
      .isRequired(ERROR_MESSAGES.getEnterYourEmailAddress)
      .isLessThanLength(100)
      .isEmail()

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
