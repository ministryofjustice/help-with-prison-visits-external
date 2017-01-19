const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')

class FutureOrPastVisit {
  constructor (advancePast) {
    this.advancePast = advancePast
    this.isValid()
  }

  isValid () {
    var errors = ErrorHandler()

    FieldValidator(this.advancePast, 'advance-past', errors)
      .isRequired('radio')
      .isValidAdvanceOrPast()

    var validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = FutureOrPastVisit
