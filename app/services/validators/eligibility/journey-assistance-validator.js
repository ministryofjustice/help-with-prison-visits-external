var FieldValidator = require('../field-validator')

class JourneyAssistanceValidator {
  static validate (data) {
    var errors = {}

    var journeyAssistance = data['journey-assistance']

    FieldValidator(journeyAssistance, 'journey-assistance', errors)
      .isRequired('journeyAssistance')

    for (var field in errors) {
      if (errors.hasOwnProperty(field)) {
        if (errors[field].length > 0) { return errors }
      }
    }
    return false
  }
}
exports.default = function (data) {
  return JourneyAssistanceValidator.validate(data)
}
module.exports = exports['default']
