const CarExpense = require('../../../../../app/services/domain/expenses/car-expense')

describe('services/domain/expenses/car-expense', () => {
  const VALID_FROM = 'some from'
  const VALID_TO = 'some to'
  const VALID_TOLL = 'yes'
  const VALID_TOLL_COST = '15'
  const VALID_PARKING = 'yes'
  const VALID_PARKING_COST = '20'
  const VALID_NEW_DESTINATION = 'on'
  const VALID_DESTINATION = 'some place'
  const VALID_POSTCODE = 'BT123BT'
  const INVALID_TOLL_COST = '0'
  const INVALID_PARKING_COST = '0'
  const INVALID_POSTCODE = 'testing'

  it('should construct a domain object given valid input', () => {
    const expense = new CarExpense(VALID_FROM, VALID_TO, VALID_TOLL, VALID_TOLL_COST, VALID_PARKING, VALID_PARKING_COST)
    expect(expense.from).toBe(VALID_FROM)
    expect(expense.to).toBe(VALID_TO)
    expect(expense.toll).toBe(VALID_TOLL)
    expect(expense.tollCost).toBe(VALID_TOLL_COST)
    expect(expense.parking).toBe(VALID_PARKING)
    expect(expense.parkingCost).toBe(VALID_PARKING_COST)
    expect(expense.tollExpense).not.toBeNull()
    expect(expense.parkingExpense).not.toBeNull()
  })

  it('should construct a domain object given valid input of new destination and postcode', () => {
    const expense = new CarExpense(
      VALID_FROM,
      VALID_TO,
      VALID_TOLL,
      VALID_TOLL_COST,
      VALID_PARKING,
      VALID_PARKING_COST,
      VALID_NEW_DESTINATION,
      VALID_DESTINATION,
      VALID_POSTCODE,
    )
    expect(expense.from).toBe(VALID_FROM)
    expect(expense.to).toBe(VALID_DESTINATION)
    expect(expense.toll).toBe(VALID_TOLL)
    expect(expense.tollCost).toBe(VALID_TOLL_COST)
    expect(expense.parking).toBe(VALID_PARKING)
    expect(expense.parkingCost).toBe(VALID_PARKING_COST)
    expect(expense.toPostCode).toBe(VALID_POSTCODE)
    expect(expense.tollExpense).not.toBeNull()
    expect(expense.parkingExpense).not.toBeNull()
  })

  it('should not return null for toll cost if toll was not set', () => {
    const expense = new CarExpense(VALID_FROM, VALID_TO)
    expect(expense.tollExpense).toBeNull()
  })

  it('should not return null for parking cost if parking was not set', () => {
    const expense = new CarExpense(VALID_FROM, VALID_TO)
    expect(expense.parkingExpense).toBeNull()
  })

  it('should throw an error if passed invalid destination', () => {
    expect(() => {
      new CarExpense(
        VALID_FROM,
        VALID_TO,
        VALID_TOLL,
        VALID_TOLL_COST,
        VALID_PARKING,
        VALID_PARKING_COST,
        VALID_NEW_DESTINATION,
        '',
        VALID_POSTCODE,
      ).isValid()
    }).toThrow()
  })

  it('should throw an error if passed invalid postcode', () => {
    expect(() => {
      new CarExpense(
        VALID_FROM,
        VALID_TO,
        VALID_TOLL,
        VALID_TOLL_COST,
        VALID_PARKING,
        VALID_PARKING_COST,
        VALID_NEW_DESTINATION,
        VALID_DESTINATION,
        INVALID_POSTCODE,
      ).isValid()
    }).toThrow()
  })

  it('should throw an error if passed invalid toll cost', () => {
    expect(() => {
      new CarExpense(VALID_FROM, VALID_TO, VALID_TOLL, INVALID_TOLL_COST, VALID_PARKING, VALID_PARKING_COST).isValid()
    }).toThrow()
  })

  it('should throw an error if passed invalid parking cost', () => {
    expect(() => {
      new CarExpense(VALID_FROM, VALID_TO, VALID_TOLL, INVALID_TOLL_COST, VALID_PARKING, INVALID_PARKING_COST).isValid()
    }).toThrow()
  })
})
