const BaseExpense = require('../../../services/domain/expenses/base-expense')
const EXPENSE_TYPE = require('../../../constants/expense-type-enum')

class CarExpense extends BaseExpense {
  constructor (claimId, from, to) {
    super(claimId, EXPENSE_TYPE.CAR, null, null, from, to, null, null, null)
  }

  isValid () {
    // TODO: Implement validation.
  }
}

module.exports = CarExpense
