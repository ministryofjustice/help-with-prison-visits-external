const BaseExpense = require('../../../services/domain/expenses/base-expense')
const EXPENSE_TYPE = require('../../../constants/expense-type-enum')
const ValidationError = require('../../errors/validation-error')
const FieldValidator = require('../../validators/field-validator')
const ErrorHandler = require('../../validators/error-handler')

class RefreshmentExpense extends BaseExpense {
  constructor (claimId, cost, travelTime) {
    super(claimId, EXPENSE_TYPE.LIGHT_REFRESHMENT, cost, travelTime, null, null, null, null, null, null)
    this.isValid()
  }

  isValid () {
    var errors = ErrorHandler()

    FieldValidator(this.travelTime, 'travel-time', errors)
      .isRequired()

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

module.exports = RefreshmentExpense
