const BaseExpense = require('./base-expense')
const EXPENSE_TYPE = require('../../../constants/expense-type-enum')
const ValidationError = require('../../errors/validation-error')
const FieldValidator = require('../../validators/field-validator')
const ErrorHandler = require('../../validators/error-handler')
const ERROR_MESSAGES = require('../../validators/validation-error-messages')

class RefreshmentExpense extends BaseExpense {
  constructor(cost) {
    super(EXPENSE_TYPE.LIGHT_REFRESHMENT.value, cost, null, null, null, null, null, null, null, null)
    this.isValid()
  }

  isValid() {
    const errors = ErrorHandler()

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

module.exports = RefreshmentExpense
