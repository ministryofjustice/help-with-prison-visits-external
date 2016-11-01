const TrainExpense = require('../../../../../app/services/domain/expenses/train-expense')
const ValidationError = require('../../../../../app/services/errors/validation-error')
const expect = require('chai').expect

describe('services/domain/expenses/train-expense', function () {
  const VALID_CLAIM_ID = '1'
  const VALID_COST = '20'
  const VALID_FROM = 'some from'
  const VALID_TO = 'some to'
  const VALID_IS_RETURN = 'yes'
  const INVALID_COST = '0'

  it('should construct a domain object given valid input', function () {
    var expense = new TrainExpense(
      VALID_CLAIM_ID,
      VALID_COST,
      VALID_FROM,
      VALID_TO,
      VALID_IS_RETURN
    )
    expect(expense.claimId).to.equal(VALID_CLAIM_ID)
    expect(expense.cost).to.equal(VALID_COST)
    expect(expense.from).to.equal(VALID_FROM)
    expect(expense.to).to.equal(VALID_TO)
    expect(expense.isReturn).to.equal(VALID_IS_RETURN)
  })

  it('should throw an error if passed invalid data', function () {
    expect(function () {
      new TrainExpense(
        VALID_CLAIM_ID,
        INVALID_COST,
        VALID_FROM,
        VALID_TO,
        VALID_IS_RETURN
      ).isValid()
    }).to.throw(ValidationError)
  })
})
