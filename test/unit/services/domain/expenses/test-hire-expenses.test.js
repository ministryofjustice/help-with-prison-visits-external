const HireExpense = require('../../../../../app/services/domain/expenses/hire-expense')

describe('services/domain/expenses/hire-expense', () => {
  const VALID_COST = '20'
  const VALID_FROM = 'some from'
  const VALID_TO = 'some to'
  const VALID_DURATION_OF_TRAVEL = '1'
  const INVALID_COST = '0'

  it('should construct a domain object given valid input', () => {
    const expense = new HireExpense(VALID_COST, VALID_FROM, VALID_TO, VALID_DURATION_OF_TRAVEL)
    expect(expense.cost).toBe(VALID_COST)
    expect(expense.from).toBe(VALID_FROM)
    expect(expense.to).toBe(VALID_TO)
    expect(expense.durationOfTravel).toBe(VALID_DURATION_OF_TRAVEL)
  })

  it('should throw an error if passed invalid data', () => {
    expect(() => {
      new HireExpense(INVALID_COST, VALID_FROM, VALID_TO, VALID_DURATION_OF_TRAVEL).isValid()
    }).toThrow()
  })
})
