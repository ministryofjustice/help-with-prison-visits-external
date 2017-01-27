const BaseExpense = require('../../../services/domain/expenses/base-expense')
const EXPENSE_TYPE = require('../../../constants/expense-type-enum')
const ValidationError = require('../../errors/validation-error')
const FieldValidator = require('../../validators/field-validator')
const ErrorHandler = require('../../validators/error-handler')

class TrainExpense extends BaseExpense {
  constructor (cost, from, to, isReturn, ticketOwner, departureTime, isAdvanceClaim) {
    super(EXPENSE_TYPE.TRAIN.value, cost, departureTime, from, to, isReturn, null, null, ticketOwner)
    this.isAdvanceClaim = isAdvanceClaim
    this.isValid()
  }

  isValid () {
    var errors = ErrorHandler()

    FieldValidator(this.from, 'from', errors)
      .isRequired()
      .isLessThanLength(100)

    FieldValidator(this.to, 'to', errors)
      .isRequired()
      .isLessThanLength(100)

    FieldValidator(this.isReturn, 'return-journey', errors)
      .isRequired()

    FieldValidator(this.ticketOwner, 'ticket-owner', errors)
      .isRequired()

    if (this.isAdvanceClaim) {
      FieldValidator(this.travelTime, 'departure-time', errors)
        .isRequired()
    } else {
      FieldValidator(this.cost, 'cost', errors)
        .isRequired()
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
