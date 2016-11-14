const CarExpense = require('../../../../../app/services/domain/expenses/car-expense')
const ValidationError = require('../../../../../app/services/errors/validation-error')
const expect = require('chai').expect

describe('services/domain/expenses/car-expense', function () {
  const VALID_FROM = 'some from'
  const VALID_TO = 'some to'
  const VALID_TOLL = 'yes'
  const VALID_TOLL_COST = '15'
  const VALID_PARKING = 'yes'
  const VALID_PARKING_COST = '20'
  const INVALID_TOLL_COST = '0'
  const INVALID_PARKING_COST = '0'

  it('should construct a domain object given valid input', function () {
    var expense = new CarExpense(
      VALID_FROM,
      VALID_TO,
      VALID_TOLL,
      VALID_TOLL_COST,
      VALID_PARKING,
      VALID_PARKING_COST
    )
    expect(expense.from).to.equal(VALID_FROM)
    expect(expense.to).to.equal(VALID_TO)
    expect(expense.toll).to.equal(VALID_TOLL)
    expect(expense.tollCost).to.equal(VALID_TOLL_COST)
    expect(expense.parking).to.equal(VALID_PARKING)
    expect(expense.parkingCost).to.equal(VALID_PARKING_COST)
    expect(expense.tollExpense).to.not.equal(null)
    expect(expense.parkingExpense).to.not.equal(null)
  })

  it('should not return null for toll cost if toll was not set', function () {
    var expense = new CarExpense(
      VALID_FROM,
      VALID_TO
    )
    expect(expense.tollExpense).to.equal(null)
  })

  it('should not return null for parking cost if parking was not set', function () {
    var expense = new CarExpense(
      VALID_FROM,
      VALID_TO
    )
    expect(expense.parkingExpense).to.equal(null)
  })

  it('should throw an error if passed invalid toll cost', function () {
    expect(function () {
      new CarExpense(
        VALID_FROM,
        VALID_TO,
        VALID_TOLL,
        INVALID_TOLL_COST,
        VALID_PARKING,
        VALID_PARKING_COST
      ).isValid()
    }).to.throw(ValidationError)
  })

  it('should throw an error if passed invalid parking cost', function () {
    expect(function () {
      new CarExpense(
        VALID_FROM,
        VALID_TO,
        VALID_TOLL,
        INVALID_TOLL_COST,
        VALID_PARKING,
        INVALID_PARKING_COST
      ).isValid()
    }).to.throw(ValidationError)
  })
})
