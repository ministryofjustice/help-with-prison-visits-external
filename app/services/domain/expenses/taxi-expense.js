const BaseExpense = require('../../../services/domain/expenses/base-expense')
const EXPENSE_TYPE = require('../../../constants/expense-type-enum')

class TaxiExpense extends BaseExpense {
  constructor (claimId, cost, from, to) {
    super(claimId, EXPENSE_TYPE.TAXI, cost, null, from, to, null, null, null)
    this.isValid()
  }

  isValid () {
    // TODO: Implement validation.
  }
}

module.exports = TaxiExpense
