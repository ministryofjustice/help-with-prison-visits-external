const BaseExpense = require('../../../services/domain/expenses/base-expense')
const EXPENSE_TYPE = require('../../../constants/expense-type-enum')
const ValidationError = require('../../errors/validation-error')
const FieldValidator = require('../../validators/field-validator')
const ErrorHandler = require('../../validators/error-handler')
const ERROR_MESSAGES = require('../../validators/validation-error-messages')

class CarExpense extends BaseExpense {
  constructor (from, to, toll, tollCost, parking, parkingCost, newDestination, destination, postcode) {
    var journeyTo = newDestination ? destination : to
    var toPostCode = newDestination ? postcode.replace(/ /g, '').toUpperCase() : null
    super(EXPENSE_TYPE.CAR.value, null, null, from, journeyTo, null, null, null, null, null, toPostCode)
    this.newDestination = newDestination
    this.toll = toll
    this.createField('tollCost', tollCost)
    this.parking = parking
    this.createField('parkingCost', parkingCost)
    this.isValid()
  }

  get tollExpense () {
    return this.toll ? new BaseExpense(
      EXPENSE_TYPE.CAR_TOLL.value,
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
      EXPENSE_TYPE.CAR_PARKING_CHARGE.value,
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

    if (this.newDestination) {
      FieldValidator(this.to, 'destination', errors)
        .isRequired(ERROR_MESSAGES.getNewCarDestination)
        .isLessThanLength(100)

      if (this.toPostCode) {
        FieldValidator(this.toPostCode, 'PostCode', errors)
          .isPostcode()
      }
    }

    if (this.toll) {
      FieldValidator(this.tollCost, 'toll-cost', errors)
        .isRequired(ERROR_MESSAGES.getEnterTollCost)
        .isCurrency()
        .isGreaterThanZero()
    }

    if (this.parking) {
      FieldValidator(this.parkingCost, 'parking-charge-cost', errors)
        .isRequired(ERROR_MESSAGES.getEnterParkingCost)
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
