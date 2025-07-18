const BaseExpense = require('./base-expense')
const EXPENSE_TYPE = require('../../../constants/expense-type-enum')
const ValidationError = require('../../errors/validation-error')
const FieldValidator = require('../../validators/field-validator')
const ErrorHandler = require('../../validators/error-handler')
const ERROR_MESSAGES = require('../../validators/validation-error-messages')

class AccommodationExpense extends BaseExpense {
  constructor(cost, durationOfTravel) {
    super(EXPENSE_TYPE.ACCOMMODATION.value, cost, null, null, null, null, durationOfTravel, null, null, null)
    this.isValid()
  }

  isValid() {
    const errors = ErrorHandler()

    FieldValidator(this.durationOfTravel, 'duration', errors)
      .isRequired(ERROR_MESSAGES.getEnterNightsStayed)
      .isNumeric()
      .isGreaterThanZero()
      .isInteger()
      .isMaxIntOrLess()

    FieldValidator(this.cost, 'cost', errors)
      .isRequired(ERROR_MESSAGES.getEnterCost)
      .isCurrency()
      .isGreaterThanZero()
      .isMaxCostOrLess()

    const validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = AccommodationExpense
