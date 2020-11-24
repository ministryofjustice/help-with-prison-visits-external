const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')
const ERROR_MESSAGES = require('../validators/validation-error-messages')

class Feedback {
  constructor (rating, improvements, emailAddress) {
    this.rating = rating
    this.improvements = improvements
    this.emailAddress = emailAddress ? emailAddress.trim() : ''
    this.isValid()
  }

  isValid () {
    const errors = ErrorHandler()

    FieldValidator(this.rating, 'rating', errors)
      .isRequired(ERROR_MESSAGES.getRadioQuestionIsRequired)

    FieldValidator(this.improvements, 'improve-service', errors)
      .isLessThanLength(1200)

    if (this.emailAddress) {
      FieldValidator(this.emailAddress, 'EmailAddress', errors)
        .isLessThanLength(100)
        .isEmail()
    }

    const validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = Feedback
