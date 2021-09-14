const ChildCareExpense = require('../../../../../app/services/domain/expenses/child-care-expense')
const expect = require('chai').expect

describe('services/domain/expenses/child-care-expense', function () {
  const VALID_COST = '20'
  const INVALID_COST = '0'

  it('should construct a domain object given valid input', function () {
    const expense = new ChildCareExpense(
      VALID_COST
    )
    expect(expense.cost).to.equal(VALID_COST)
  })

  it('should throw an error if passed invalid data', function () {
    expect(function () {
      new ChildCareExpense(
        INVALID_COST
      ).isValid()
    }).to.throw()
  })
})
