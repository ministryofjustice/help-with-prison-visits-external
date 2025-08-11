const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')
const ERROR_MESSAGES = require('../validators/validation-error-messages')

class PrisonerRelationship {
  constructor(relationship) {
    this.relationship = relationship ? relationship.trim() : ''
    this.isValid()
  }

  isValid() {
    const errors = ErrorHandler()

    FieldValidator(this.relationship, 'relationship', errors)
      .isRequired(ERROR_MESSAGES.getRadioQuestionIsRequired)
      .isValidPrisonerRelationship()

    const validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = PrisonerRelationship
