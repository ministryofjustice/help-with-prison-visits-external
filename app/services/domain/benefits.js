const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')
const ERROR_MESSAGES = require('../validators/validation-error-messages')

class Benefits {
  constructor(benefit, benefitOwner) {
    this.benefit = benefit ? benefit.trim() : ''
    this.benefitOwner = benefitOwner ? benefitOwner.trim() : ''
    this.isValid()
  }

  isValid() {
    const errors = ErrorHandler()

    FieldValidator(this.benefit, 'benefit', errors).isRequired(ERROR_MESSAGES.getBenefitRequired).isValidBenefit(true)

    FieldValidator(this.benefitOwner, 'benefitOwner', errors)
      .isRequired(ERROR_MESSAGES.getBenefitOwnerRequired)
      .isValidBenefit(true)

    const validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = Benefits
