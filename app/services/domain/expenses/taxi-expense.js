const BaseExpense = require('../../../services/domain/expenses/base-expense')
const EXPENSE_TYPE = require('../../../constants/expense-type-enum')
const ValidationError = require('../../errors/validation-error')
const FieldValidator = require('../../validators/field-validator')
const ErrorHandler = require('../../validators/error-handler')

class TaxiExpense extends BaseExpense {
  constructor (claimId, cost, from, to) {
    super(claimId, EXPENSE_TYPE.TAXI, cost, null, from, to, null, null, null)
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

    FieldValidator(this.cost, 'cost', errors)
      .isRequired()
      .isCurrency()
      .isGreaterThanZero()

    var validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = TaxiExpense
