const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')
const BenefitEnum = require('../../constants/benefits-enum')
const ExpenseEnum = require('../../constants/expense-type-enum')
const DisplayHelper = require('../../views/helpers/display-helper')
const ERROR_MESSAGES = require('../validators/validation-error-messages')

class ClaimSummary {
  constructor(visitConfirmation, benefit, benefitDocument, claimExpenses, isAdvanceClaim, benefitUploadNotRequired) {
    this.benefit = benefit
    this.claimExpenses = claimExpenses
    this.benefitDocumentStatus = benefitDocument ? benefitDocument.DocumentStatus : ''
    this.visitConfirmationStatus = visitConfirmation ? visitConfirmation.DocumentStatus : ''
    this.isAdvanceClaim = isAdvanceClaim
    this.benefitUploadNotRequired = benefitUploadNotRequired
    this.isValid()
  }

  isValid() {
    const errors = ErrorHandler()

    if (BenefitEnum.getByValue(this.benefit).requireBenefitUpload && !this.benefitUploadNotRequired) {
      FieldValidator(this.benefitDocumentStatus, 'benefit-information', errors).isRequired(
        ERROR_MESSAGES.getDocumentOnSummary,
      )
    }

    if (this.claimExpenses.length <= 0) {
      errors.add('claim-expense', ERROR_MESSAGES.getNoExpensesClaimedFor)
    }

    if (!this.isAdvanceClaim) {
      FieldValidator(this.visitConfirmationStatus, 'VisitConfirmation', errors).isRequired(
        ERROR_MESSAGES.getDocumentOnSummary,
      )
    }

    if (!this.isAdvanceClaim) {
      this.claimExpenses.forEach(expense => {
        if (DisplayHelper.getExpenseReceiptRequired(expense.ExpenseType)) {
          FieldValidator(expense.DocumentStatus, 'claim-expense', errors).isRequired(
            ERROR_MESSAGES.getDocumentOnSummary,
          )
        }
      })
    }

    checkForZeroExpense(this.claimExpenses, this.isAdvanceClaim, errors)

    const validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = ClaimSummary

function checkForZeroExpense(claimExpenses, isAdvanceClaim, errors) {
  claimExpenses.forEach(expense => {
    if (
      expense.ExpenseType !== ExpenseEnum.CAR.value &&
      !(expense.ExpenseType === ExpenseEnum.TRAIN.value && isAdvanceClaim)
    ) {
      FieldValidator(expense.Cost, 'claim-expense', errors).isGreaterThanZero()
    }
  })
}
