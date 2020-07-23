const AccommodationExpense = require('../../../../../app/services/domain/expenses/accommodation-expense')
const expect = require('chai').expect

describe('services/domain/expenses/accommodation-expense', function () {
  const VALID_COST = '20'
  const VALID_DURATION_OF_TRAVEL = '1'
  const INVALID_COST = '0'

  it('should construct a domain object given valid input', function () {
    var expense = new AccommodationExpense(
      VALID_COST,
      VALID_DURATION_OF_TRAVEL
    )
    expect(expense.cost).to.equal(VALID_COST)
    expect(expense.durationOfTravel).to.equal(VALID_DURATION_OF_TRAVEL)
  })

  it('should throw an error if passed invalid data', function () {
    return expect(function () {
      new AccommodationExpense(
        INVALID_COST,
        VALID_DURATION_OF_TRAVEL
      ).isValid()
    }).to.throw()
  })
})
