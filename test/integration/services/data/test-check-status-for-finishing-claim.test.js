const { expect } = require('chai')
const checkStatusForFinishingClaim = require('../../../../app/services/data/check-status-for-finishing-claim')
const eligibilityHelper = require('../../../helpers/data/eligibility-helper')
const { getDatabaseConnector } = require('../../../../app/databaseConnector')

describe('services/data/check-status-for-finishing-claim', () => {
  const REFERENCE = 'FINSTAT'
  let claimId
  let eligibilityId

  beforeEach(() => {
    return eligibilityHelper.insertEligibilityClaim(REFERENCE).then(function (ids) {
      claimId = ids.claimId
      eligibilityId = ids.eligibilityId
    })
  })

  afterEach(() => {
    return eligibilityHelper.deleteAll(REFERENCE)
  })

  it('should return true for claim that is in progress', () => {
    return checkStatusForFinishingClaim(REFERENCE, eligibilityId, claimId).then(result => {
        expect(result).to.be.true  //eslint-disable-line
    })
  })

  it('should return false claim not being in progress', () => {
    const db = getDatabaseConnector()

    return db('Claim')
      .update({ Status: 'NOT-IN-PROGRESS' })
      .where({ ClaimId: claimId, Reference: REFERENCE })
      .then(() => {
        return checkStatusForFinishingClaim(REFERENCE, eligibilityId, claimId).then(result => {
            expect(result).to.be.false  //eslint-disable-line
        })
      })
  })
})
