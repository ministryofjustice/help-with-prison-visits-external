const AccommodationExpense = require('../../../../../app/services/domain/expenses/accommodation-expense')

describe('services/domain/expenses/accommodation-expense', () => {
  const VALID_COST = '20'
  const VALID_DURATION_OF_TRAVEL = '1'
  const INVALID_COST = '0'

  it('should construct a domain object given valid input', () => {
    const expense = new AccommodationExpense(VALID_COST, VALID_DURATION_OF_TRAVEL)
    expect(expense.cost).toBe(VALID_COST)
    expect(expense.durationOfTravel).toBe(VALID_DURATION_OF_TRAVEL)
  })

  it('should throw an error if passed invalid data', () => {
    return expect(() => {
      new AccommodationExpense(INVALID_COST, VALID_DURATION_OF_TRAVEL).isValid()
    }).toThrow()
  })
})
