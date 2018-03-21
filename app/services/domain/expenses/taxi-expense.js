const BaseExpense = require('../../../services/domain/expenses/base-expense')
const EXPENSE_TYPE = require('../../../constants/expense-type-enum')
const ValidationError = require('../../errors/validation-error')
const FieldValidator = require('../../validators/field-validator')
const ErrorHandler = require('../../validators/error-handler')
const ERROR_MESSAGES = require('../../validators/validation-error-messages')

class TaxiExpense extends BaseExpense {
  constructor (cost, from, to) {
    super(EXPENSE_TYPE.TAXI.value, cost, null, from, to, null, null, null, null, null)
    this.isValid()
  }

  isValid () {
    var errors = ErrorHandler()

    FieldValidator(this.from, 'from', errors)
      .isRequired(ERROR_MESSAGES.getEnterFrom)
      .isLessThanLength(100)

    FieldValidator(this.to, 'to', errors)
      .isRequired(ERROR_MESSAGES.getEnterTo)
      .isLessThanLength(100)

    FieldValidator(this.cost, 'cost', errors)
      .isRequired(ERROR_MESSAGES.getEnterCost)
      .isCurrency()
      .isGreaterThanZero()
      .isMaxCostOrLess()

    var validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = TaxiExpense
