const { expect } = require('chai')
const getExpenseOwnerData = require('../../../../app/services/data/get-expense-owner-data')
const eligibilityHelper = require('../../../helpers/data/eligibility-helper')
const claimHelper = require('../../../helpers/data/claim-helper')
const claimEscortHelper = require('../../../helpers/data/claim-escort-helper')
const claimChildHelper = require('../../../helpers/data/claim-child-helper')

describe('services/data/get-expense-owner-data', () => {
  const REFERENCE = 'V123467'
  let claimId
  let eligibilityId

  beforeEach(() => {
    return eligibilityHelper
      .insert(REFERENCE)
      .then(id => {
        eligibilityId = id

        return claimHelper.insert(REFERENCE, eligibilityId)
      })
      .then(id => {
        claimId = id
      })
  })

  afterEach(() => {
    return eligibilityHelper.deleteAll(REFERENCE)
  })

  it('should return true if a ClaimEscort is associated to claim', () => {
    return claimEscortHelper
      .insert(REFERENCE, eligibilityId, claimId)
      .then(() => {
        return getExpenseOwnerData(claimId, eligibilityId, REFERENCE)
      })
      .then(expenseOwnerData => {
        expect(expenseOwnerData.escort).to.be.true  //eslint-disable-line
        expect(expenseOwnerData.child).to.be.false  //eslint-disable-line
      })
  })

  it('should return true if a ClaimChild is associated to claim', () => {
    return claimChildHelper
      .insert(REFERENCE, eligibilityId, claimId)
      .then(() => {
        return getExpenseOwnerData(claimId, eligibilityId, REFERENCE)
      })
      .then(expenseOwnerData => {
        expect(expenseOwnerData.escort).to.be.false  //eslint-disable-line
        expect(expenseOwnerData.child).to.be.true  //eslint-disable-line
      })
  })

  it('should return true if both a ClaimChild and ClaimEscort are associated to claim', () => {
    return claimChildHelper
      .insert(REFERENCE, eligibilityId, claimId)
      .then(() => {
        return claimEscortHelper.insert(REFERENCE, eligibilityId, claimId)
      })
      .then(() => {
        return getExpenseOwnerData(claimId, eligibilityId, REFERENCE)
      })
      .then(expenseOwnerData => {
        expect(expenseOwnerData.escort).to.be.true  //eslint-disable-line
        expect(expenseOwnerData.child).to.be.true  //eslint-disable-line
      })
  })

  it('should return false if neither a ClaimChild or ClaimEscort are associated to claim', () => {
    return getExpenseOwnerData(claimId, eligibilityId, REFERENCE).then(expenseOwnerData => {
        expect(expenseOwnerData.escort).to.be.false  //eslint-disable-line
        expect(expenseOwnerData.child).to.be.false  //eslint-disable-line
    })
  })
})
