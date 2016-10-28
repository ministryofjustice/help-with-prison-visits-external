const BaseExpense = require('../../../services/domain/expenses/base-expense')
const EXPENSE_TYPE = require('../../../constants/expense-type-enum')

class BusExpense extends BaseExpense {
  constructor (claimId, from, to, returnJourney, cost) {
    super(claimId, EXPENSE_TYPE.BUS, from, to, returnJourney, cost, null, null)
  }

  isValid () {
    // TODO: Implement validation.
  }

}

module.exports = BusExpense
