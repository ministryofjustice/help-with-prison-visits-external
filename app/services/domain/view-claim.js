const ValidationError = require('../errors/validation-error')
const ERROR_MESSAGES = require('../validators/validation-error-messages')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')

class ViewClaim {
  constructor (visitConfirmationDocumentNotUpdated, benefitDocumentNotUpdated, claimExpenses, message, bankDetails) {
    this.visitConfirmationDocumentNotUpdated = visitConfirmationDocumentNotUpdated
    this.benefitDocumentNotUpdated = benefitDocumentNotUpdated
    this.claimExpenses = claimExpenses
    this.message = message
    this.bankDetails = bankDetails
    this.updated = false
    this.isValid()
  }

  isValid () {
    var self = this
    var errors = ErrorHandler()

    this.claimExpenses.forEach(function (expense) {
      if (!expense.fromInternalWeb) {
        self.updated = true
      }
    })

    if (!this.updated && this.visitConfirmationDocumentNotUpdated && this.benefitDocumentNotUpdated && !this.message && !this.bankDetails.required) {
      throw new ValidationError({updates: [ERROR_MESSAGES.getNoUpdatesMade]})
    }

    FieldValidator(this.message, 'send-message-to-caseworker', errors)
      .isLessThanLength(1000)

    if (this.bankDetails.required) {
      FieldValidator(this.bankDetails.accountNumber, 'AccountNumber', errors)
        .isRequired()
        .isNumeric()
        .isLength(8)

      FieldValidator(this.bankDetails.sortCode, 'SortCode', errors)
        .isRequired()
        .isNumeric()
        .isLength(6)
    }

    var validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = ViewClaim
