const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')
const ERROR_MESSAGES = require('../validators/validation-error-messages')

class BankAccountDetails {
  constructor (accountNumber, sortCode, termsAndConiditions) {
    this.accountNumber = accountNumber.replace(/ /g, '')
    this.sortCode = sortCode.replace(/ |-/g, '')
    this.termsAndConiditions = termsAndConiditions
    this.IsValid()
  }

  IsValid () {
    var errors = ErrorHandler()

    FieldValidator(this.accountNumber, 'AccountNumber', errors)
      .isRequired(ERROR_MESSAGES.getEnterAccountNumber)
      .isNumeric()
      .isLength(8)

    FieldValidator(this.sortCode, 'SortCode', errors)
      .isRequired(ERROR_MESSAGES.getEnterSortCode)
      .isNumeric()
      .isLength(6)

    FieldValidator(this.termsAndConiditions, 'terms-and-conditions', errors)
      .isRequired(ERROR_MESSAGES.getDisclaimer)

    var validationErrors = errors.get()

    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = BankAccountDetails
