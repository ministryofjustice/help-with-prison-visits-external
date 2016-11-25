const expect = require('chai').expect
const getLastClaimExpenses = require('../../../../app/services/data/get-last-claim-expenses')
const internalEligiblityHelper = require('../../../helpers/data/internal/internal-eligibility-helper')
const internalClaimExpenseHelper = require('../../../helpers/data/internal/internal-claim-expense-helper')

describe('services/data/get-last-claim-expenses', function () {
  const REFERENCE = 'MASK467'
  const INVALID_REFERENCE = 'INVALID'
  var eligibilityId

  before(function () {
    return internalEligiblityHelper.insertEligibilityAndClaim(REFERENCE)
      .then(function (ids) {
        eligibilityId = ids.eligibilityId
      })
  })

  after(function () {
    return internalEligiblityHelper.deleteAll(REFERENCE)
  })

  it('should retrieve last claim expenses given reference and eligibilityId', function () {
    return getLastClaimExpenses(REFERENCE, eligibilityId)
      .then(function (expenses) {
        expect(expenses.length).to.be.equal(1)
        expect(expenses[0].ExpenseType).to.be.equal(internalClaimExpenseHelper.EXPENSE_TYPE)
      })
  })

  it('should return empty for an invalid reference and eligibilityId', function () {
    return getLastClaimExpenses(INVALID_REFERENCE, '1234')
      .then(function (expenses) {
        expect(expenses.length).to.be.equal(0)
      })
  })
})
