var FieldValidator = require('../field-validator')

class BenefitValidator {
  static validate (data) {
    var errors = {}

    var benefit = data['benefit']

    FieldValidator(benefit, 'benefit', errors)
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
  return BenefitValidator.validate(data)
}
module.exports = exports['default']
