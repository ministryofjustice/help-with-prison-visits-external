const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')

class ClaimSummary {
  constructor (visitConfirmation) {
    this.visitConfirmationStatus = visitConfirmation ? visitConfirmation.DocumentStatus : ''
    this.IsValid()
  }

  IsValid () {
    var errors = ErrorHandler()

    FieldValidator(this.visitConfirmationStatus, 'VisitConfirmation', errors)
      .isRequired()

    var validationErrors = errors.get()

    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = ClaimSummary
