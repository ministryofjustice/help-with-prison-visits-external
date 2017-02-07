const RefreshmentExpense = require('../../../../../app/services/domain/expenses/refreshment-expense')
const ValidationError = require('../../../../../app/services/errors/validation-error')
const expect = require('chai').expect

describe('services/domain/expenses/refreshment-expense', function () {
  const VALID_COST = '20'
  const INVALID_COST = '0'

  it('should construct a domain object given valid input', function () {
    var expense = new RefreshmentExpense(
      VALID_COST
    )
    expect(expense.cost).to.equal(VALID_COST)
  })

  it('should throw an error if passed invalid data', function () {
    expect(function () {
      new RefreshmentExpense(
        INVALID_COST
      ).isValid()
    }).to.throw(ValidationError)
  })
})
