const ValidationError = require('../errors/validation-error')
const ERROR_MESSAGES = require('../validators/validation-error-messages')

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
    var self = this

    this.claimExpenses.forEach(function (expense) {
      if (!expense.fromInternalWeb) {
        self.updated = true
      }
    })

    if (!this.updated && this.visitConfirmationDocumentNotUpdated && this.benefitDocumentNotUpdated && this.message !== '') {
      throw new ValidationError({updates: [ERROR_MESSAGES.getNoUpdatesMade]})
    }
  }
}

module.exports = ViewClaim
