const BaseExpense = require('../../../services/domain/expenses/base-expense')
const EXPENSE_TYPE = require('../../../constants/expense-type-enum')
const ValidationError = require('../../errors/validation-error')
const FieldValidator = require('../../validators/field-validator')
const ErrorHandler = require('../../validators/error-handler')
const ERROR_MESSAGES = require('../../validators/validation-error-messages')

class HireExpense extends BaseExpense {
  constructor (cost, from, to, durationOfTravel) {
    super(EXPENSE_TYPE.CAR_HIRE.value, cost, null, from, to, null, durationOfTravel, null, null, null)
    this.isValid()
  }

  isValid () {
    var errors = ErrorHandler()

    FieldValidator(this.durationOfTravel, 'duration', errors)
      .isRequired(ERROR_MESSAGES.getEnterNumberOfDays)
      .isNumeric()
      .isGreaterThanZero()

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

    var validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = HireExpense
