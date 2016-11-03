const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const ExpenseBase = require('../../services/domain/expenses/base-expense')

module.exports.insert = function (expense) {
  if (!(expense instanceof ExpenseBase)) {
    throw new Error('Provided object is not an instance of the expected class')
  }

  return knex('ClaimExpense').insert({
    ClaimId: expense.claimId,
    ExpenseType: expense.expenseType || null,
    Cost: expense.cost || 0,
    TravelTime: expense.travelTime || null,
    From: expense.from || null,
    To: expense.to || null,
    IsReturn: expense.isReturn === 'yes',
    DurationOfTravel: expense.durationOfTravel || null,
    TicketType: expense.ticketType || null
  })
}
