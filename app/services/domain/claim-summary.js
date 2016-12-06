const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')
const BenefitEnum = require('../../constants/benefits-enum')
const DisplayHelper = require('../../views/helpers/display-helper')

class ClaimSummary {
  constructor (visitConfirmation, benefit, benefitDocument, claimExpenses, isAdvanceClaim) {
    this.benefit = benefit
    this.claimExpenses = claimExpenses
    this.benefitDocumentStatus = benefitDocument ? benefitDocument.DocumentStatus : ''
    this.visitConfirmationStatus = visitConfirmation ? visitConfirmation.DocumentStatus : ''
    this.isAdvanceClaim = isAdvanceClaim
    this.isValid()
  }

  isValid () {
    var errors = ErrorHandler()

    if (BenefitEnum.getByValue(this.benefit).requireBenefitUpload) {
      FieldValidator(this.benefitDocumentStatus, 'benefit-information', errors)
        .isRequired()
    }

    if (!this.isAdvanceClaim) {
      FieldValidator(this.visitConfirmationStatus, 'VisitConfirmation', errors)
        .isRequired()
    }

    if (!this.isAdvanceClaim) {
      this.claimExpenses.forEach(function (expense) {
        if (DisplayHelper.getExpenseReceiptRequired(expense.ExpenseType)) {
          FieldValidator(expense.DocumentStatus, 'claim-expense', errors)
            .isRequired()
        }
      })
    }

    var validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = ClaimSummary
