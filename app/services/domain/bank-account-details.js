const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')
const ERROR_MESSAGES = require('../validators/validation-error-messages')
const unsafeInputPattern = />|<|&lt|&gt/g

class BankAccountDetails {
  constructor (accountNumber, sortCode, nameOnAccount, rollNumber) {
    this.accountNumber = accountNumber.replace(/ /g, '')
    this.sortCode = sortCode.replace(/ |-/g, '')
    this.nameOnAccount = nameOnAccount ? nameOnAccount.replace(unsafeInputPattern, '').trim() : ''
    this.rollNumber = rollNumber ? rollNumber.replace(unsafeInputPattern, '') : ''
    this.IsValid()
  }

  IsValid () {
    const errors = ErrorHandler()

    FieldValidator(this.accountNumber, 'AccountNumber', errors)
      .isRequired(ERROR_MESSAGES.getEnterAccountNumber)
      .isNumeric()
      .isLength(8, ERROR_MESSAGES.getIsLengthDigitsMessage)

    FieldValidator(this.sortCode, 'SortCode', errors)
      .isRequired(ERROR_MESSAGES.getEnterSortCode)
      .isNumeric()
      .isLength(6, ERROR_MESSAGES.getIsLengthDigitsMessage)

    FieldValidator(this.nameOnAccount, 'NameOnAccount', errors)
      .isRequired(ERROR_MESSAGES.getNameOnAccount)
      .isLessThanLength(100, ERROR_MESSAGES.getNameOnAccountLessThanLengthMessage)

    if (this.rollNumber) {
      if (this.rollNumber !== '') {
        FieldValidator(this.rollNumber, 'RollNumber', errors)
          .isRange(1, 18)
          .isValidRollNumber()
      }
    }

    const validationErrors = errors.get()

    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = BankAccountDetails
