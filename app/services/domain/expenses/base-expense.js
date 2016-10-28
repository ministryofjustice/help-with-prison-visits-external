/**
 * This is a base class for all of the expense domain objects.
 */
class ExpenseBase {
  constructor (claimId, expenseType, cost, travelTime, from, to, isReturn, durationOfTravel, ticketType) {
    this.createField('claimId', claimId)
    this.createField('expenseType', expenseType)
    this.createField('cost', cost)
    this.createField('travelTime', travelTime)
    this.createField('from', from)
    this.createField('to', to)
    this.isReturn = isReturn === 'yes'
    this.createField('durationOfTravel', durationOfTravel)
    this.createField('ticketType', ticketType)
  }

  createField (key, value) {
    this[key] = value ? value.trim() : null
  }
}

module.exports = ExpenseBase
