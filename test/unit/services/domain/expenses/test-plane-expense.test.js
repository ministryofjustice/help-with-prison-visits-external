const PlaneExpense = require('../../../../../app/services/domain/expenses/plane-expense')

describe('services/domain/expenses/plane-expense', () => {
  const VALID_COST = '20'
  const VALID_FROM = 'some from'
  const VALID_TO = 'some to'
  const VALID_IS_RETURN = 'yes'
  const VALID_TICKET_OWNER = 'escort'
  const INVALID_COST = '0'

  it('should construct a domain object given valid input', () => {
    const expense = new PlaneExpense(VALID_COST, VALID_FROM, VALID_TO, VALID_IS_RETURN, VALID_TICKET_OWNER)
    expect(expense.cost).toBe(VALID_COST)
    expect(expense.from).toBe(VALID_FROM)
    expect(expense.to).toBe(VALID_TO)
    expect(expense.isReturn).toBe(VALID_IS_RETURN)
    expect(expense.ticketOwner).toBe(VALID_TICKET_OWNER)
  })

  it('should throw an error if passed invalid data', () => {
    expect(() => {
      new PlaneExpense(INVALID_COST, VALID_FROM, VALID_TO, VALID_IS_RETURN, VALID_TICKET_OWNER).isValid()
    }).toThrow()
  })
})
