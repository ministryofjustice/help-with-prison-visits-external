const FieldValidator = require('../field-validator')
const ErrorHandler = require('../error-handler')

class ExpensesValidator {
  static validate (data) {
    var errors = ErrorHandler()

    FieldValidator(data['expenses'], 'expenses', errors)
      .isRequired()

    return errors.get()
  }
}

module.exports = function (data) {
  return ExpensesValidator.validate(data)
}
