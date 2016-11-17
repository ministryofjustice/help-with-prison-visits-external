const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')
const BenefitEnum = require('../../constants/benefits-enum')

class ClaimSummary {
  constructor (visitConfirmation, benefit, benefitDocument, claimExpenses) {
    this.benefit = benefit
    this.claimExpenses = claimExpenses
    this.benefitDocumentStatus = benefitDocument ? benefitDocument.DocumentStatus : ''
    this.visitConfirmationStatus = visitConfirmation ? visitConfirmation.DocumentStatus : ''
    this.IsValid()
  }

  IsValid () {
    var errors = ErrorHandler()

    if (BenefitEnum[this.benefit].requireBenefitUpload) {
      FieldValidator(this.benefitDocumentStatus, 'benefit-information', errors)
        .isRequired()
    }

    FieldValidator(this.visitConfirmationStatus, 'VisitConfirmation', errors)
      .isRequired()

    this.claimExpenses.forEach(function (expense) {
      FieldValidator(expense.DocumentStatus, 'claim-expense', errors)
        .isRequired()
    })

    var validationErrors = errors.get()

    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = ClaimSummary
