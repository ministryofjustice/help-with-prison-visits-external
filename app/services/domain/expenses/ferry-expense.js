const BaseExpense = require('../../../services/domain/expenses/base-expense')
const EXPENSE_TYPE = require('../../../constants/expense-type-enum')
const ValidationError = require('../../errors/validation-error')
const FieldValidator = require('../../validators/field-validator')
const ErrorHandler = require('../../validators/error-handler')
const ERROR_MESSAGES = require('../../validators/validation-error-messages')

class FerryExpense extends BaseExpense {
  constructor (cost, from, to, returnJourney, ticketType, ticketOwner) {
    super(EXPENSE_TYPE.FERRY.value, cost, null, from, to, returnJourney, null, ticketType, ticketOwner, null)
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

    FieldValidator(this.isReturn, 'return-journey', errors)
      .isRequired(ERROR_MESSAGES.getReturn)

    FieldValidator(this.ticketOwner, 'ticket-owner', errors)
      .isRequired(ERROR_MESSAGES.getTicketOwner)

    FieldValidator(this.ticketType, 'ticket-type', errors)
      .isRequired(ERROR_MESSAGES.getTicketType)

    FieldValidator(this.cost, 'cost', errors)
      .isRequired(ERROR_MESSAGES.getEnterCost)
      .isCurrency()
      .isGreaterThanZero()
      .isMaxIntOrLess()

    var validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = FerryExpense
