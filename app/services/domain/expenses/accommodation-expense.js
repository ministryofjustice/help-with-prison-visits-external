const BaseExpense = require('../../../services/domain/expenses/base-expense')
const EXPENSE_TYPE = require('../../../constants/expense-type-enum')

class AccommodationExpense extends BaseExpense {
  constructor (claimId, cost, durationOfTravel) {
    super(claimId, EXPENSE_TYPE.ACCOMMODATION, cost, null, null, null, null, durationOfTravel, null)
  }

  isValid () {
    // TODO: Implement validation.
  }
}

module.exports = AccommodationExpense
