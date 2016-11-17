const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')

class PrisonerRelationship {
  constructor (relationship) {
    this.relationship = relationship ? relationship.trim() : ''
    this.isValid()
  }

  isValid () {
    var errors = ErrorHandler()

    FieldValidator(this.relationship, 'relationship', errors)
      .isRequired('radio')
      .isValidPrisonerRelationship()

    var validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = PrisonerRelationship
