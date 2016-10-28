const BaseExpense = require('../../../services/domain/expenses/base-expense')
const EXPENSE_TYPE = require('../../../constants/expense-type-enum')

class TrainExpense extends BaseExpense {
  constructor (claimId, cost, from, to, returnJourney) {
    super(claimId, EXPENSE_TYPE.TRAIN, cost, null, from, to, returnJourney, null, null)
  }

  isValid () {
    // TODO: Implement validation.
  }
}

module.exports = TrainExpense
