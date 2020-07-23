const expect = require('chai').expect
const checkStatusForFinishingClaim = require('../../../../app/services/data/check-status-for-finishing-claim')
const eligibilityHelper = require('../../../helpers/data/eligibility-helper')
const config = require('../../../../knexfile').extweb
const knex = require('knex')(config)

describe('services/data/check-status-for-finishing-claim', function () {
  const REFERENCE = 'FINSTAT'
  var claimId
  var eligibilityId

  beforeEach(function () {
    return eligibilityHelper.insertEligibilityClaim(REFERENCE)
      .then(function (ids) {
        claimId = ids.claimId
        eligibilityId = ids.eligibilityId
      })
  })

  afterEach(function () {
    return eligibilityHelper.deleteAll(REFERENCE)
  })

  it('should return true for claim that is in progress', function () {
    return checkStatusForFinishingClaim(REFERENCE, eligibilityId, claimId)
      .then(function (result) {
        expect(result).to.be.true  //eslint-disable-line
      })
  })

  it('should return false claim not being in progress', function () {
    return knex('Claim').update({ Status: 'NOT-IN-PROGRESS' }).where({ ClaimId: claimId, Reference: REFERENCE })
      .then(function () {
        return checkStatusForFinishingClaim(REFERENCE, eligibilityId, claimId)
          .then(function (result) {
            expect(result).to.be.false  //eslint-disable-line
          })
      })
  })
})
