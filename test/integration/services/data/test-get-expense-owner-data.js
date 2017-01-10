const expect = require('chai').expect
const getExpenseOwnerData = require('../../../../app/services/data/get-expense-owner-data')
const eligibilityHelper = require('../../../helpers/data/eligibility-helper')
const claimHelper = require('../../../helpers/data/claim-helper')
const claimEscortHelper = require('../../../helpers/data/claim-escort-helper')
const claimChildHelper = require('../../../helpers/data/claim-child-helper')

describe('services/data/get-expense-owner-data', function () {
  const REFERENCE = 'V123467'
  var claimId
  var eligibilityId

  beforeEach(function () {
    return eligibilityHelper.insert(REFERENCE)
      .then(function (id) {
        eligibilityId = id

        return claimHelper.insert(REFERENCE, eligibilityId)
      })
      .then(function (id) {
        claimId = id
      })
  })

  afterEach(function () {
    return eligibilityHelper.deleteAll(REFERENCE)
  })

  it('should return true if a ClaimEscort is associated to claim', function () {
    return claimEscortHelper.insert(REFERENCE, eligibilityId, claimId)
      .then(function () {
        return getExpenseOwnerData(claimId, eligibilityId, REFERENCE)
      })
      .then(function (expenseOwnerData) {
        expect(expenseOwnerData.escort).to.be.true
        expect(expenseOwnerData.child).to.be.false
      })
  })

  it('should return true if a ClaimChild is associated to claim', function () {
    return claimChildHelper.insert(REFERENCE, eligibilityId, claimId)
      .then(function () {
        return getExpenseOwnerData(claimId, eligibilityId, REFERENCE)
      })
      .then(function (expenseOwnerData) {
        expect(expenseOwnerData.escort).to.be.false
        expect(expenseOwnerData.child).to.be.true
      })
  })

  it('should return true if both a ClaimChild and ClaimEscort are associated to claim', function () {
    return claimChildHelper.insert(REFERENCE, eligibilityId, claimId)
      .then(function () {
        return claimEscortHelper.insert(REFERENCE, eligibilityId, claimId)
      })
      .then(function () {
        return getExpenseOwnerData(claimId, eligibilityId, REFERENCE)
      })
      .then(function (expenseOwnerData) {
        expect(expenseOwnerData.escort).to.be.true
        expect(expenseOwnerData.child).to.be.true
      })
  })

  it('should return false if neither a ClaimChild or ClaimEscort are associated to claim', function () {
    return getExpenseOwnerData(claimId, eligibilityId, REFERENCE)
      .then(function (expenseOwnerData) {
        expect(expenseOwnerData.escort).to.be.false
        expect(expenseOwnerData.child).to.be.false
      })
  })
})
