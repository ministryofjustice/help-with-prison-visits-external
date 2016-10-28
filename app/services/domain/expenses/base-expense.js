/**
 * This is a base class for all of the expense domain objects.
 */
class ExpenseBase {
  constructor (claimId, expenseType, from, to, returnJourney, cost, duration, travelTime) {
    this.createField('claimId', claimId)
    this.createField('expenseType', expenseType)
    this.createField('from', from)
    this.createField('to', to)
    this.createField('returnJourney', returnJourney)
    this.createField('cost', cost)
    this.createField('duration', duration)
    this.createField('travelTime', travelTime)
  }

  createField (key, value) {
    this[key] = value ? value.trim() : null
  }
}

module.exports = ExpenseBase
