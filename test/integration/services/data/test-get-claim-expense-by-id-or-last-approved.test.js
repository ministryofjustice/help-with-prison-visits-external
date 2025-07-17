const { expect } = require('chai')
const getClaimExpenseByIdOrLastApproved = require('../../../../app/services/data/get-claim-expense-by-id-or-last-approved')
const internalEligiblityHelper = require('../../../helpers/data/internal/internal-eligibility-helper')
const internalClaimExpenseHelper = require('../../../helpers/data/internal/internal-claim-expense-helper')

describe('services/data/get-claim-expense-by-id-or-last-approved', () => {
  const REFERENCE = 'MASK467'
  const INVALID_REFERENCE = 'INVALID'
  let eligibilityId
  let claimId

  before(() => {
    return internalEligiblityHelper.insertEligibilityAndClaim(REFERENCE).then(function (ids) {
      eligibilityId = ids.eligibilityId
      claimId = ids.claimId
    })
  })

  after(() => {
    return internalEligiblityHelper.deleteAll(REFERENCE)
  })

  it('should retrieve last claim expenses given reference and eligibilityId', () => {
    return getClaimExpenseByIdOrLastApproved(REFERENCE, eligibilityId, null).then(function (expenses) {
      expect(expenses.length).to.be.equal(1)
      expect(expenses[0].ExpenseType).to.be.equal(internalClaimExpenseHelper.EXPENSE_TYPE)
    })
  })

  it('should retrieve last claim expenses given reference and claimId', () => {
    return getClaimExpenseByIdOrLastApproved(REFERENCE, null, claimId).then(function (expenses) {
      expect(expenses.length).to.be.equal(1)
      expect(expenses[0].ExpenseType).to.be.equal(internalClaimExpenseHelper.EXPENSE_TYPE)
    })
  })

  it('should return empty for an invalid reference and eligibilityId', () => {
    return getClaimExpenseByIdOrLastApproved(INVALID_REFERENCE, '1234', null).then(function (expenses) {
      expect(expenses.length).to.be.equal(0)
    })
  })
})
