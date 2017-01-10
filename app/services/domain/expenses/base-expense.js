const unsafeInputPattern = new RegExp(/>|<|&lt|&gt/g)
/**
 * This is a base class for all of the expense domain objects.
 */
class BaseExpense {
  constructor (expenseType, cost, travelTime, from, to, isReturn, durationOfTravel, ticketType, ticketOwner) {
    this.createField('expenseType', expenseType)
    this.createField('cost', cost)
    this.createField('travelTime', travelTime)
    this.createField('from', from)
    this.createField('to', to)
    this.createField('isReturn', isReturn)
    this.createField('durationOfTravel', durationOfTravel)
    this.createField('ticketType', ticketType)
    this.createField('ticketOwner', ticketOwner)
  }

  createField (key, value) {
    this[key] = value ? value.toString().replace(unsafeInputPattern, '').trim() : ''
  }
}

module.exports = BaseExpense
