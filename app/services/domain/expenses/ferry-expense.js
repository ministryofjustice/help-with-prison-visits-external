const BaseExpense = require('../../../services/domain/expenses/base-expense')
const EXPENSE_TYPE = require('../../../constants/expense-type-enum')

class FerryExpense extends BaseExpense {
  constructor (claimId, cost, from, to, returnJourney, ticketType) {
    super(claimId, EXPENSE_TYPE.FERRY, cost, null, from, to, returnJourney, null, ticketType)
    this.isValid()
  }

  isValid () {
    // TODO: Implement validation.
  }
}

module.exports = FerryExpense
