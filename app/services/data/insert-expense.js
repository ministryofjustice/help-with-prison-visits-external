const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const ExpenseBase = require('../../services/domain/expenses/base-expense')

module.exports = function (expense) {
  if (!(expense instanceof ExpenseBase)) {
    throw new Error('Provided object is not an instance of the expected class')
  }

  return knex('ClaimExpense').insert({
    ClaimId: expense.claimId,
    ExpenseType: expense.expenseType,
    Cost: expense.cost || 0,
    TravelTime: expense.travelTime,
    From: expense.from,
    To: expense.to,
    IsReturn: expense.isReturn,
    DurationOfTravel: expense.durationOfTravel,
    TicketType: expense.ticketType
  })
}
