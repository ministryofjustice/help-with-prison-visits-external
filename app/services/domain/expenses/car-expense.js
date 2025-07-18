const BaseExpense = require('./base-expense')
const EXPENSE_TYPE = require('../../../constants/expense-type-enum')
const ValidationError = require('../../errors/validation-error')
const FieldValidator = require('../../validators/field-validator')
const ErrorHandler = require('../../validators/error-handler')
const ERROR_MESSAGES = require('../../validators/validation-error-messages')

class CarExpense extends BaseExpense {
  constructor(
    from,
    to,
    toll,
    tollCost,
    parking,
    parkingCost,
    newDestination,
    destination,
    postcode,
    newOrigin,
    origin,
    originPostCode,
  ) {
    const journeyTo = newDestination ? destination : to
    const toPostCode = newDestination ? postcode.replace(/ /g, '').toUpperCase() : null
    const journeyFrom = newOrigin ? origin : from
    const fromPostCode = newOrigin ? originPostCode.replace(/ /g, '').toUpperCase() : null
    super(
      EXPENSE_TYPE.CAR.value,
      null,
      null,
      journeyFrom,
      journeyTo,
      null,
      null,
      null,
      null,
      null,
      toPostCode,
      fromPostCode,
    )
    this.newDestination = newDestination
    this.newOrigin = newOrigin
    this.toll = toll
    this.createField('tollCost', tollCost)
    this.parking = parking
    this.createField('parkingCost', parkingCost)
    this.isValid()
  }

  get tollExpense() {
    return this.toll
      ? new BaseExpense(EXPENSE_TYPE.CAR_TOLL.value, this.tollCost, null, this.from, this.to, null, null, null)
      : null
  }

  get parkingExpense() {
    return this.parking
      ? new BaseExpense(
          EXPENSE_TYPE.CAR_PARKING_CHARGE.value,
          this.parkingCost,
          null,
          this.from,
          this.to,
          null,
          null,
          null,
        )
      : null
  }

  isValid() {
    const errors = ErrorHandler()

    if (this.newDestination) {
      FieldValidator(this.to, 'destination', errors)
        .isRequired(ERROR_MESSAGES.getNewCarDestination)
        .isLessThanLength(100)

      if (this.toPostCode) {
        FieldValidator(this.toPostCode, 'PostCode', errors).isPostcode()
      }
    }

    if (this.newOrigin) {
      FieldValidator(this.from, 'origin', errors).isRequired(ERROR_MESSAGES.getNewCarOrigin).isLessThanLength(100)
    }

    if (this.newOrigin) {
      FieldValidator(this.fromPostCode, 'FromPostCode', errors)
        .isRequired(ERROR_MESSAGES.getNewCarOriginPostcode)
        .isPostcode()
    }

    if (this.toll) {
      FieldValidator(this.tollCost, 'toll-cost', errors)
        .isRequired(ERROR_MESSAGES.getEnterTollCost)
        .isCurrency()
        .isGreaterThanZero()
        .isMaxCostOrLess()
    }

    if (this.parking) {
      FieldValidator(this.parkingCost, 'parking-charge-cost', errors)
        .isRequired(ERROR_MESSAGES.getEnterParkingCost)
        .isCurrency()
        .isGreaterThanZero()
        .isMaxCostOrLess()
    }

    const validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = CarExpense
