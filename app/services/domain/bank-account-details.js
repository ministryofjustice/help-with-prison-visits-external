const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')

class BankAccountDetails {
  constructor (accountNumber, sortCode, tAndCs) {
    this.accountNumber = accountNumber.replace(/ /g, '')
    this.sortCode = sortCode.replace(/ /g, '')
    this.tAndCs = tAndCs
    this.IsValid()
  }

  IsValid () {
    var errors = ErrorHandler()

    FieldValidator(this.accountNumber, 'AccountNumber', errors)
      .isRequired()
      .isNumeric()
      .isLength(8)

    FieldValidator(this.sortCode, 'SortCode', errors)
      .isRequired()
      .isNumeric()
      .isLength(6)

    FieldValidator(this.tAndCs, 'terms-and-conditions', errors)
      .isRequired()

    var validationErrors = errors.get()

    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = BankAccountDetails
