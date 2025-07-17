/* eslint-disable no-new */
const TrainExpense = require('../../../../../app/services/domain/expenses/train-expense')

describe('services/domain/expenses/train-expense', () => {
  const VALID_COST = '20'
  const VALID_FROM = 'some from'
  const VALID_TO = 'some to'
  const VALID_IS_RETURN = 'yes'
  const VALID_TICKET_OWNER = 'you'
  const VALID_DEPARTURE_TIME = '10am'
  const EMPTY_DEPARTURE_TIME = ''
  const VALID_RETURN_TIME = '4pm'
  const EMPTY_RETURN_TIME = ''
  const INVALID_COST = '0'

  const IS_PAST_CLAIM = false
  const IS_ADVANCE_CLAIM = true

  const INVALID_CHARS_FROM = '&lt>><somewhere<>>>>&gt'
  const INVALID_CHARS_TO = '&><>To somewhere<&gt<>'

  it('should construct a domain object given valid input', () => {
    const expense = new TrainExpense(
      VALID_COST,
      VALID_FROM,
      VALID_TO,
      VALID_IS_RETURN,
      VALID_TICKET_OWNER,
      EMPTY_DEPARTURE_TIME,
      EMPTY_RETURN_TIME,
      IS_PAST_CLAIM,
    )
    expect(expense.cost).toBe(VALID_COST)
    expect(expense.from).toBe(VALID_FROM)
    expect(expense.to).toBe(VALID_TO)
    expect(expense.isReturn).toBe(VALID_IS_RETURN)
    expect(expense.isAdvanceClaim).toBe(IS_PAST_CLAIM)
  })

  it('should construct a domain object given valid input', () => {
    const expense = new TrainExpense(
      VALID_COST,
      VALID_FROM,
      VALID_TO,
      VALID_IS_RETURN,
      VALID_TICKET_OWNER,
      VALID_DEPARTURE_TIME,
      VALID_RETURN_TIME,
      IS_ADVANCE_CLAIM,
    )
    expect(expense.cost).toBe(VALID_COST)
    expect(expense.from).toBe(VALID_FROM)
    expect(expense.to).toBe(VALID_TO)
    expect(expense.isReturn).toBe(VALID_IS_RETURN)
    expect(expense.ticketOwner).toBe(VALID_TICKET_OWNER)
    expect(expense.isAdvanceClaim).toBe(IS_ADVANCE_CLAIM)
  })

  it('should strip illegal characters from otherwise valid input', () => {
    const unsafeInputPattern = />|<|&lt|&gt/g
    const expense = new TrainExpense(
      VALID_COST,
      INVALID_CHARS_FROM,
      INVALID_CHARS_TO,
      VALID_IS_RETURN,
      VALID_TICKET_OWNER,
      EMPTY_DEPARTURE_TIME,
      EMPTY_RETURN_TIME,
      IS_PAST_CLAIM,
    )
    expect(expense.cost).toBe(VALID_COST)
    expect(expense.from).toBe(INVALID_CHARS_FROM.replace(unsafeInputPattern, ''))
    expect(expense.to).toBe(INVALID_CHARS_TO.replace(unsafeInputPattern, ''))
    expect(expense.isReturn).toBe(VALID_IS_RETURN)
    expect(expense.ticketOwner).toBe(VALID_TICKET_OWNER)
    expect(expense.isAdvanceClaim).toBe(IS_PAST_CLAIM)
  })

  it('should throw an error if passed invalid past claim data', () => {
    expect(() => {
      new TrainExpense(
        INVALID_COST,
        VALID_FROM,
        VALID_TO,
        VALID_IS_RETURN,
        EMPTY_DEPARTURE_TIME,
        VALID_TICKET_OWNER,
        EMPTY_RETURN_TIME,
        IS_PAST_CLAIM,
      )
    }).toThrow()
  })

  it('should throw an error if passed invalid advance claim data - no return', () => {
    expect(() => {
      new TrainExpense(
        VALID_COST,
        VALID_FROM,
        VALID_TO,
        VALID_IS_RETURN,
        EMPTY_DEPARTURE_TIME,
        VALID_TICKET_OWNER,
        EMPTY_RETURN_TIME,
        IS_ADVANCE_CLAIM,
      )
    }).toThrow()
  })
})
