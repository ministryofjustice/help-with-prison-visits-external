const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const BaseExpense = require('../../services/domain/expenses/base-expense')

module.exports = function (reference, eligibilityId, claimId, expense) {
  if (!(expense instanceof BaseExpense)) {
    throw new Error('Provided object is not an instance of the expected class')
  }

  return knex('ClaimExpense').insert({
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
    IsEnabled: true
  })
}
