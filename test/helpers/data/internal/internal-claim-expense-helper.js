const config = require('../../../../knexfile').migrations
const knex = require('knex')(config)

module.exports.CLAIM_EXPENSE_ID = Math.floor(Date.now() / 100) - 14000000000
module.exports.EXPENSE_TYPE = 'bus'
module.exports.COST = '10'
module.exports.TRAVEL_TIME = null
module.exports.FROM = 'London'
module.exports.TO = 'Edinburgh'
module.exports.IS_RETURN = true
module.exports.DURATION_OF_TRAVEL = null
module.exports.TICKET_TYPE = null
module.exports.TICKET_OWNER = 'you'

module.exports.build = function () {
  return {
    ClaimExpenseId: this.CLAIM_EXPENSE_ID,
    ExpenseType: this.EXPENSE_TYPE,
    Cost: this.COST,
    TravelTime: this.TRAVEL_TIME,
    From: this.FROM,
    To: this.TO,
    IsReturn: this.IS_RETURN,
    DurationOfTravel: this.DURATION_OF_TRAVEL,
    TicketType: this.TICKET_TYPE,
    TicketOwner: this.TICKET_OWNER,
    IsEnabled: true
  }
}

module.exports.insert = function (reference, eligibilityId, claimId, data) {
  var expense = data || this.build()

  return knex('IntSchema.ClaimExpense').insert({
    ClaimExpenseId: expense.ClaimExpenseId,
    ClaimId: claimId,
    EligibilityId: eligibilityId,
    Reference: reference,
    ExpenseType: expense.ExpenseType,
    Cost: expense.Cost,
    TravelTime: expense.TravelTime,
    From: expense.From,
    To: expense.To,
    IsReturn: expense.IsReturn,
    DurationOfTravel: expense.DurationOfTravel,
    TicketType: expense.TicketType,
    TicketOwner: expense.TicketOwner,
    IsEnabled: expense.IsEnabled
  })
}

module.exports.get = function (claimId) {
  return knex.first()
    .from('IntSchema.ClaimExpense')
    .where('ClaimId', claimId)
}

module.exports.delete = function (claimId) {
  return knex('IntSchema.ClaimExpense')
    .where('ClaimId', claimId)
    .del()
}
