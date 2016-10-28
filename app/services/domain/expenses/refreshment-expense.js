const BaseExpense = require('../../../services/domain/expenses/base-expense')
const EXPENSE_TYPE = require('../../../constants/expense-type-enum')

class RefreshmentExpense extends BaseExpense {
  constructor (claimId, cost, travelTime) {
    super(claimId, EXPENSE_TYPE.LIGHT_REFRESHMENT, cost, travelTime, null, null, null, null, null)
    this.isValid()
  }

  isValid () {
    // TODO: Implement validation.
  }
}

module.exports = RefreshmentExpense
