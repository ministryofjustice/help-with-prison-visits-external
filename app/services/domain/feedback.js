const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')
const ERROR_MESSAGES = require('../validators/validation-error-messages')

class Feedback {
  constructor (rating, improvements) {
    this.rating = rating
    this.improvements = improvements
    this.isValid()
  }

  isValid () {
    var errors = ErrorHandler()

    FieldValidator(this.rating, 'rating', errors)
      .isRequired(ERROR_MESSAGES.getRadioQuestionIsRequired)

    FieldValidator(this.improvements, 'improve-service', errors)
      .isLessThanLength(1200)

    var validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = Feedback
