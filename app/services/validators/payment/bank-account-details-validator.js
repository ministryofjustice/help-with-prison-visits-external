const FieldValidator = require('../field-validator')
const ErrorHandler = require('../error-handler')

class BankAccountDetailsValidator {
  static validate (data) {
    var errors = ErrorHandler()

    var accountNumber = data['AccountNumber'].replace(/ /g, '')
    var sortCode = data['SortCode'].replace(/ /g, '')

    FieldValidator(accountNumber, 'AccountNumber', errors)
      .isRequired()
      .isNumeric()
      .isLength(8)

    FieldValidator(sortCode, 'SortCode', errors)
      .isRequired()
      .isNumeric()
      .isLength(6)

    return errors.get()
  }
}
module.exports = function (data) {
  return BankAccountDetailsValidator.validate(data)
}
