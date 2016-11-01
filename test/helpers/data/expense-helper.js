const config = require('../../../knexfile').migrations
const knex = require('knex')(config)
const BusExpense = require('../../../app/services/domain/expenses/bus-expense')
const insertExpense = require('../../../app/services/data/insert-expense')

module.exports.EXPENSE_TYPE = 'bus'
module.exports.COST = '10'
module.exports.TRAVEL_TIME = null
module.exports.FROM = 'London'
module.exports.TO = 'Edinburgh'
module.exports.IS_RETURN = 'yes'
module.exports.DURATION_OF_TRAVEL = null
module.exports.TICKET_TYPE = null

module.exports.insert = function (claimId) {
  var expense = new BusExpense(
    claimId,
    this.COST,
    this.FROM,
    this.TO,
    this.IS_RETURN
  )
  return insertExpense(expense)
}

module.exports.get = function (claimId) {
  return knex.first()
    .from('ExtSchema.ClaimExpense')
    .where('ClaimId', claimId)
}

module.exports.delete = function (claimId) {
  return knex('ExtSchema.ClaimExpense')
    .where('ClaimId', claimId)
    .del()
}
