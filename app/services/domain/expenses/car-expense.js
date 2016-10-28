const BaseExpense = require('../../../services/domain/expenses/base-expense')
const EXPENSE_TYPE = require('../../../constants/expense-type-enum')

class CarExpense extends BaseExpense {
  constructor (claimId, from, to, toll, tollCost, parking, parkingCost) {
    super(claimId, EXPENSE_TYPE.CAR, null, null, from, to, null, null, null)
    this.toll = toll
    this.tollCost = tollCost ? tollCost.trim() : null
    this.parking = parking
    this.parkingCost = parkingCost ? parkingCost.trim() : null
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
    // TODO: Implement validation and validate if toll/parking is set they need values.
  }
}

module.exports = CarExpense
