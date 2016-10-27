const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const FieldsetValidator = require('../validators/fieldset-validator')
const ErrorHandler = require('../validators/error-handler')

class Claim {
  constructor (
    reference,
    dateOfJourney,
    dateCreated,
    dateSubmitted,
    status
  ) {
    this.reference = reference.replace(/ /g, '')
    this.dateOfJourney = dateOfJourney
    this.dateCreated = dateCreated
    this.dateSubmitted = dateSubmitted
    this.status = status
    this.IsValid()
  }

  IsValid () {
    var errors = ErrorHandler()

    FieldValidator(this.reference, 'Reference', errors)
      .isRequired()
      .isReference()

    FieldsetValidator(this.dateOfJourney, 'DateOfJourney', errors)
      .isValidDate(this.dateOfJourney)

    FieldsetValidator(this.dateCreated, 'DateCreated', errors)
      .isValidDate(this.dateCreated)

    FieldValidator(this.status, 'Status', errors)
      .isRequired()
      .isStatus()

    var validationErrors = errors.get()

    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = Claim
