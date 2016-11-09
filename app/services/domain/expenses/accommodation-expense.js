const BaseExpense = require('../../../services/domain/expenses/base-expense')
const EXPENSE_TYPE = require('../../../constants/expense-type-enum')
const ValidationError = require('../../errors/validation-error')
const FieldValidator = require('../../validators/field-validator')
const ErrorHandler = require('../../validators/error-handler')

class AccommodationExpense extends BaseExpense {
  constructor (claimId, cost, durationOfTravel) {
    super(claimId, EXPENSE_TYPE.ACCOMMODATION, cost, null, null, null, null, durationOfTravel, null, null)
    this.isValid()
  }

  isValid () {
    var errors = ErrorHandler()

    FieldValidator(this.durationOfTravel, 'duration', errors)
      .isRequired()
      .isNumeric()
      .isGreaterThanZero()

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

module.exports = AccommodationExpense
