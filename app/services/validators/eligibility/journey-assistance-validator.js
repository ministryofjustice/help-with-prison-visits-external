const FieldValidator = require('../field-validator')
const ErrorHandler = require('../error-handler')

class JourneyAssistanceValidator {
  static validate (data) {
    var errors = ErrorHandler()
    var assistance = data['assistance']

    FieldValidator(assistance, 'assistance', errors)
      .isRequired('radio')

    return errors.get()
  }
}

module.exports = function (data) {
  return JourneyAssistanceValidator.validate(data)
}
