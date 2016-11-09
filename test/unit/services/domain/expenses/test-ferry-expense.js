const FerryExpense = require('../../../../../app/services/domain/expenses/ferry-expense')
const ValidationError = require('../../../../../app/services/errors/validation-error')
const expect = require('chai').expect

describe('services/domain/expenses/ferry-expense', function () {
  const VALID_CLAIM_ID = '1'
  const VALID_COST = '20'
  const VALID_FROM = 'some from'
  const VALID_TO = 'some to'
  const VALID_IS_RETURN = 'yes'
  const VALID_TICKET_TYPE = 'car passenger'
  const VALID_IS_CHILD = 'yes'
  const INVALID_COST = '0'

  it('should construct a domain object given valid input', function () {
    var expense = new FerryExpense(
      VALID_CLAIM_ID,
      VALID_COST,
      VALID_FROM,
      VALID_TO,
      VALID_IS_RETURN,
      VALID_TICKET_TYPE,
      VALID_IS_CHILD
    )
    expect(expense.claimId).to.equal(VALID_CLAIM_ID)
    expect(expense.cost).to.equal(VALID_COST)
    expect(expense.from).to.equal(VALID_FROM)
    expect(expense.to).to.equal(VALID_TO)
    expect(expense.isReturn).to.equal(VALID_IS_RETURN)
    expect(expense.ticketType).to.equal(VALID_TICKET_TYPE)
    expect(expense.isChild).to.equal(VALID_IS_CHILD)
  })

  it('should throw an error if passed invalid data', function () {
    expect(function () {
      new FerryExpense(
        VALID_CLAIM_ID,
        INVALID_COST,
        VALID_FROM,
        VALID_TO,
        VALID_IS_RETURN,
        VALID_TICKET_TYPE,
        VALID_IS_CHILD
      ).isValid()
    }).to.throw(ValidationError)
  })
})
