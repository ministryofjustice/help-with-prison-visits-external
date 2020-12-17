const TaxiExpense = require('../../../../../app/services/domain/expenses/taxi-expense')
const expect = require('chai').expect

describe('services/domain/expenses/taxi-expense', function () {
  const VALID_COST = '20'
  const VALID_FROM = 'some from'
  const VALID_TO = 'some to'
  const INVALID_COST = '0'

  it('should construct a domain object given valid input', function () {
    const expense = new TaxiExpense(
      VALID_COST,
      VALID_FROM,
      VALID_TO
    )
    expect(expense.cost).to.equal(VALID_COST)
    expect(expense.from).to.equal(VALID_FROM)
    expect(expense.to).to.equal(VALID_TO)
  })

  it('should throw an error if passed invalid data', function () {
    expect(function () {
      new TaxiExpense(
        INVALID_COST,
        VALID_FROM,
        VALID_TO
      ).isValid()
    }).to.throw()
  })
})
