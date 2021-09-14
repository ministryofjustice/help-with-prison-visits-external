const BaseExpense = require('../../../services/domain/expenses/base-expense')
const EXPENSE_TYPE = require('../../../constants/expense-type-enum')
const ValidationError = require('../../errors/validation-error')
const FieldValidator = require('../../validators/field-validator')
const ErrorHandler = require('../../validators/error-handler')
const ERROR_MESSAGES = require('../../validators/validation-error-messages')

class ChildCareExpense extends BaseExpense {
  constructor (cost) {
    super(EXPENSE_TYPE.CHILD_CARE.value, cost, null, null, null, null, null, null, null, null)
    this.isValid()
  }

  isValid () {
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

module.exports = ChildCareExpense
