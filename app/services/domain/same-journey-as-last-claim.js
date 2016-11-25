const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')

class SameJourneyAsLastClaim {
  constructor (sameJourneyAsLastClaim) {
    this.sameJourneyAsLastClaim = sameJourneyAsLastClaim
    this.isValid()
  }

  isValid () {
    var errors = ErrorHandler()

    FieldValidator(this.sameJourneyAsLastClaim, 'same-journey-as-last-claim', errors)
      .isRequired()

    var validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = SameJourneyAsLastClaim
