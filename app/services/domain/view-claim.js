const ValidationError = require('../errors/validation-error')
const ERROR_MESSAGES = require('../validators/validation-error-messages')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')

class ViewClaim {
  constructor (visitConfirmationDocumentNotUpdated, benefitDocumentNotUpdated, claimExpenses, message) {
    this.visitConfirmationDocumentNotUpdated = visitConfirmationDocumentNotUpdated
    this.benefitDocumentNotUpdated = benefitDocumentNotUpdated
    this.claimExpenses = claimExpenses
    this.message = message
    this.updated = false
    this.isValid()
  }

  isValid () {
    const self = this
    const errors = ErrorHandler()

    this.claimExpenses.forEach(function (expense) {
      if (!expense.fromInternalWeb) {
        self.updated = true
      }
    })

    if (!this.updated && this.visitConfirmationDocumentNotUpdated && this.benefitDocumentNotUpdated && !this.message) {
      throw new ValidationError({ updates: [ERROR_MESSAGES.getNoUpdatesMade] })
    }

    FieldValidator(this.message, 'send-message-to-caseworker', errors)
      .isLessThanLength(1000)

    const validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = ViewClaim
