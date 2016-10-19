const FieldValidator = require('../field-validator')
const ErrorHandler = require('../error-handler')

class BankAccountDetailsValidator {
  static validate (data) {
    var errors = ErrorHandler()

    var accountNumber = data['AccountNumber']
    var sortCode = data['SortCode']

    FieldValidator(accountNumber, 'AccountNumber', errors)
      .isRequired()
      .isLength(8)

    FieldValidator(sortCode, 'SortCode', errors)
      .isRequired()
      .isLength(6)

    return errors.get()
  }
}
module.exports = function (data) {
  return BankAccountDetailsValidator.validate(data)
}
