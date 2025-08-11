const { getDatabaseConnector } = require('../../databaseConnector')
const BaseExpense = require('../domain/expenses/base-expense')
const disableNonTicketedExpensesForClaim = require('./disable-non-ticketed-expenses-for-claim')

module.exports = (reference, eligibilityId, claimId, expense) => {
  if (!(expense instanceof BaseExpense)) {
    throw new Error('Provided object is not an instance of the expected class')
  }

  return disableNonTicketedExpensesForClaim(reference, eligibilityId, claimId, expense.expenseType).then(() => {
    const db = getDatabaseConnector()

    return db('ClaimExpense')
      .insert({
        EligibilityId: eligibilityId,
        Reference: reference,
        ClaimId: claimId,
        ExpenseType: expense.expenseType || null,
        Cost: expense.cost || 0,
        TravelTime: expense.travelTime || null,
        From: expense.from || null,
        To: expense.to || null,
        IsReturn: expense.isReturn === 'yes',
        DurationOfTravel: expense.durationOfTravel || null,
        TicketType: expense.ticketType || null,
        TicketOwner: expense.ticketOwner || null,
        IsEnabled: true,
        ReturnTime: expense.returnTime || null,
        ToPostCode: expense.toPostCode || null,
        FromPostCode: expense.fromPostCode || null,
      })
      .returning('ClaimExpenseId')
  })
}
