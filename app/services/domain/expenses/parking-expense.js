const BaseExpense = require('../../../services/domain/expenses/base-expense')
const EXPENSE_TYPE = require('../../../constants/expense-type-enum')

class ParkingExpense extends BaseExpense {
  constructor (claimId, cost, from, to) {
    super(claimId, EXPENSE_TYPE.CAR_PARKING_CHARGE, cost, null, from, to, null, null, null)
  }

  isValid () {
    // TODO: Implement validation.
  }
}

module.exports = ParkingExpense
