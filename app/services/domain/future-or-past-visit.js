const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')
const ERROR_MESSAGES = require('../validators/validation-error-messages')

class FutureOrPastVisit {
  constructor(advancePast) {
    this.advancePast = advancePast
    this.isValid()
  }

  isValid() {
    const errors = ErrorHandler()

    FieldValidator(this.advancePast, 'advance-past', errors)
      .isRequired(ERROR_MESSAGES.getRadioQuestionIsRequired)
      .isValidAdvanceOrPast()

    const validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = FutureOrPastVisit
