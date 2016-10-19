const FieldValidator = require('../field-validator')
const ErrorHandler = require('../error-handler')

class PrisonerRelationshipValidator {
  static validate (data) {
    var errors = ErrorHandler()
    var relationship = data['relationship']

    FieldValidator(relationship, 'relationship', errors)
      .isRequired('radio')

    return errors.get()
  }
}

module.exports = function (data) {
  return PrisonerRelationshipValidator.validate(data)
}
