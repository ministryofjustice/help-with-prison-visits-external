const RefreshmentExpense = require('../../../../../app/services/domain/expenses/refreshment-expense')

describe('services/domain/expenses/refreshment-expense', () => {
  const VALID_COST = '20'
  const INVALID_COST = '0'

  it('should construct a domain object given valid input', () => {
    const expense = new RefreshmentExpense(VALID_COST)
    expect(expense.cost).toBe(VALID_COST)
  })

  it('should throw an error if passed invalid data', () => {
    expect(() => {
      new RefreshmentExpense(INVALID_COST).isValid()
    }).toThrow()
  })
})
