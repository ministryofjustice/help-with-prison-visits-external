const BaseExpense = require('../../../services/domain/expenses/base-expense')
const EXPENSE_TYPE = require('../../../constants/expense-type-enum')

class HireExpense extends BaseExpense {
  constructor (claimId, cost, from, to, durationOfTravel) {
    super(claimId, EXPENSE_TYPE.CAR_HIRE, cost, null, from, to, null, durationOfTravel, null)
    this.isValid()
  }

  isValid () {
    // TODO: Implement validation.
  }
}

module.exports = HireExpense
