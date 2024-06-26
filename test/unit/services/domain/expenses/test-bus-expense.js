const BusExpense = require('../../../../../app/services/domain/expenses/bus-expense')

describe('services/domain/expenses/bus-expense', function () {
  const VALID_COST = '20'
  const VALID_FROM = 'some from'
  const VALID_TO = 'some to'
  const VALID_IS_RETURN = 'yes'
  const VALID_TICKET_OWNER = 'you'
  const INVALID_COST = '0'

  it('should construct a domain object given valid input', function () {
    const expense = new BusExpense(
      VALID_COST,
      VALID_FROM,
      VALID_TO,
      VALID_IS_RETURN,
      VALID_TICKET_OWNER
    )
    expect(expense.cost).toBe(VALID_COST)
    expect(expense.from).toBe(VALID_FROM)
    expect(expense.to).toBe(VALID_TO)
    expect(expense.isReturn).toBe(VALID_IS_RETURN)
    expect(expense.ticketOwner).toBe(VALID_TICKET_OWNER)
  })

  it('should throw an error if passed invalid data', function () {
    expect(function () {
      new BusExpense(
        INVALID_COST,
        VALID_FROM,
        VALID_TO,
        VALID_IS_RETURN,
        VALID_TICKET_OWNER
      ).isValid()
    }).toThrow()
  })
})
