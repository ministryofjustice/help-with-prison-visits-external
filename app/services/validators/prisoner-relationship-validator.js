var FieldValidator = require('./field-validator')

class PrisonerRelationshipValidator {
  validate (data) {
    var errors = {}

    var relationship = data['relationship']

    FieldValidator(relationship, 'relationship', errors)
      .isRequired()

    for (var field in errors) {
      if (errors.hasOwnProperty(field)) {
        if (errors[field].length > 0) { return errors }
      }
    }
    return false
  }
}
exports.default = function (data) {
  return new PrisonerRelationshipValidator().validate(data)
}
module.exports = exports['default']
