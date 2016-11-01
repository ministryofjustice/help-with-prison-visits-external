const HireExpense = require('../../../../../app/services/domain/expenses/hire-expense')
const ValidationError = require('../../../../../app/services/errors/validation-error')
const expect = require('chai').expect

describe('services/domain/expenses/hire-expense', function () {
  const VALID_CLAIM_ID = '1'
  const VALID_COST = '20'
  const VALID_FROM = 'some from'
  const VALID_TO = 'some to'
  const VALID_DURATION_OF_TRAVEL = '1'
  const INVALID_COST = '0'

  it('should construct a domain object given valid input', function () {
    var expense = new HireExpense(
      VALID_CLAIM_ID,
      VALID_COST,
      VALID_FROM,
      VALID_TO,
      VALID_DURATION_OF_TRAVEL
    )
    expect(expense.claimId).to.equal(VALID_CLAIM_ID)
    expect(expense.cost).to.equal(VALID_COST)
    expect(expense.from).to.equal(VALID_FROM)
    expect(expense.to).to.equal(VALID_TO)
    expect(expense.durationOfTravel).to.equal(VALID_DURATION_OF_TRAVEL)
  })

  it('should throw an error if passed invalid data', function () {
    expect(function () {
      new HireExpense(
        VALID_CLAIM_ID,
        INVALID_COST,
        VALID_FROM,
        VALID_TO,
        VALID_DURATION_OF_TRAVEL
      ).isValid()
    }).to.throw(ValidationError)
  })
})
