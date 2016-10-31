const BaseExpense = require('../../../services/domain/expenses/base-expense')
const EXPENSE_TYPE = require('../../../constants/expense-type-enum')
const ValidationError = require('../../errors/validation-error')
const FieldValidator = require('../../validators/field-validator')
const ErrorHandler = require('../../validators/error-handler')

class CarExpense extends BaseExpense {
  constructor (claimId, from, to, toll, tollCost, parking, parkingCost) {
    super(claimId, EXPENSE_TYPE.CAR, null, null, from, to, null, null, null)
    this.toll = toll
    this.createField('tollCost', tollCost)
    this.parking = parking
    this.createField('parkingCost', parkingCost)
    this.isValid()
  }

  get tollExpense () {
    return this.toll ? new BaseExpense(
      this.claimId,
      EXPENSE_TYPE.CAR_TOLL,
      this.tollCost,
      null,
      this.from,
      this.to,
      null,
      null,
      null
    ) : null
  }

  get parkingExpense () {
    return this.parking ? new BaseExpense(
      this.claimId,
      EXPENSE_TYPE.CAR_PARKING_CHARGE,
      this.parkingCost,
      null,
      this.from,
      this.to,
      null,
      null,
      null
    ) : null
  }

  isValid () {
    var errors = ErrorHandler()

    if (this.toll) {
      FieldValidator(this.tollCost, 'toll-cost', errors)
        .isRequired()
        .isCurrency()
        .isGreaterThanZero()
    }

    if (this.parking) {
      FieldValidator(this.parkingCost, 'parking-charge-cost', errors)
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

module.exports = CarExpense
