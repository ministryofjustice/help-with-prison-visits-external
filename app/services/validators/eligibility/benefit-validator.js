const FieldValidator = require('../field-validator')
const ErrorHandler = require('../error-handler')

class BenefitValidator {
  static validate (data) {
    var errors = ErrorHandler()
    var benefit = data['benefit']

    FieldValidator(benefit, 'benefit', errors)
      .isRequired('radio')

    return errors.get()
  }
}

module.exports = function (data) {
  return BenefitValidator.validate(data)
}
