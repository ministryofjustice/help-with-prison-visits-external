const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')
const ERROR_MESSAGES = require('../validators/validation-error-messages')

class PaymentDetails {
  constructor (paymentMethod) {
    this.paymentMethod = paymentMethod
    this.IsValid()
  }

  IsValid () {
    var errors = ErrorHandler()

    FieldValidator(this.paymentMethod, 'PaymentMethod', errors)
      .isRequired(ERROR_MESSAGES.getPaymentMethod)

    var validationErrors = errors.get()

    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = PaymentDetails
