const BaseExpense = require('../../../services/domain/expenses/base-expense')
const EXPENSE_TYPE = require('../../../constants/expense-type-enum')
const ValidationError = require('../../errors/validation-error')
const FieldValidator = require('../../validators/field-validator')
const ErrorHandler = require('../../validators/error-handler')
const ERROR_MESSAGES = require('../../validators/validation-error-messages')

class TrainExpense extends BaseExpense {
  constructor (cost, from, to, isReturn, ticketOwner, departureTime, isAdvanceClaim) {
    super(EXPENSE_TYPE.TRAIN.value, cost, departureTime, from, to, isReturn, null, null, ticketOwner)
    this.isAdvanceClaim = isAdvanceClaim
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

    if (this.isAdvanceClaim) {
      FieldValidator(this.travelTime, 'departure-time', errors)
        .isRequired(ERROR_MESSAGES.getEnterDepartureTime)
    } else {
      FieldValidator(this.cost, 'cost', errors)
        .isRequired(ERROR_MESSAGES.getEnterCost)
        .isCurrency()
        .isGreaterThanZero()
    }

    var validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = TrainExpense
