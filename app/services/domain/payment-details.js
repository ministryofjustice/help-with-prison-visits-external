const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')
const ERROR_MESSAGES = require('../validators/validation-error-messages')

class PaymentDetails {
  constructor (accountNumber, sortCode, payout) {
    this.accountNumber = accountNumber.replace(/ /g, '')
    this.sortCode = sortCode.replace(/ |-/g, '')
    this.payout = payout
    this.IsValid()
  }

  IsValid () {
    var errors = ErrorHandler()

    if (!this.payout) {
      FieldValidator(this.accountNumber, 'AccountNumber', errors)
        .isRequired(ERROR_MESSAGES.getEnterAccountNumber)
        .isNumeric()
        .isLength(8, ERROR_MESSAGES.getIsLengthDigitsMessage)

      FieldValidator(this.sortCode, 'SortCode', errors)
        .isRequired(ERROR_MESSAGES.getEnterSortCode)
        .isNumeric()
        .isLength(6, ERROR_MESSAGES.getIsLengthDigitsMessage)
    }

    var validationErrors = errors.get()

    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = PaymentDetails
