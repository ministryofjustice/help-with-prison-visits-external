const TaxiExpense = require('../../../../../app/services/domain/expenses/taxi-expense')

describe('services/domain/expenses/taxi-expense', () => {
  const VALID_COST = '20'
  const VALID_FROM = 'some from'
  const VALID_TO = 'some to'
  const INVALID_COST = '0'

  it('should construct a domain object given valid input', () => {
    const expense = new TaxiExpense(VALID_COST, VALID_FROM, VALID_TO)
    expect(expense.cost).toBe(VALID_COST)
    expect(expense.from).toBe(VALID_FROM)
    expect(expense.to).toBe(VALID_TO)
  })

  it('should throw an error if passed invalid data', () => {
    expect(() => {
      new TaxiExpense(INVALID_COST, VALID_FROM, VALID_TO).isValid()
    }).toThrow()
  })
})
