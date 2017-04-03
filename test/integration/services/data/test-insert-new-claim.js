const expect = require('chai').expect
const insertNewClaim = require('../../../../app/services/data/insert-new-claim')
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const claimHelper = require('../../../helpers/data/claim-helper')
const moment = require('moment')

describe('services/data/insert-new-claim', function () {
  const REFERENCE = 'APVS137'
  const CLAIM_TYPE = 'repeat'
  var eligibilityId
  var claimId

  before(function () {
    return eligiblityHelper.insert(REFERENCE)
      .then(function (newEligibilityId) {
        eligibilityId = newEligibilityId
      })
  })

  it('should insert a new Claim record', function () {
    return insertNewClaim(REFERENCE, eligibilityId, CLAIM_TYPE, claimHelper.build(REFERENCE))
      .then(function (newClaimId) {
        claimId = newClaimId
        return claimHelper.get(claimId)
      })
      .then(function (claim) {
        expect(claim.EligibilityId).to.be.equal(eligibilityId)
        expect(claim.Reference).to.be.equal(REFERENCE)
        expect(claim.ClaimType).to.be.equal(CLAIM_TYPE)
        expect(claim.IsAdvanceClaim).to.be.equal(claimHelper.IS_ADVANCE_CLAIM)
        expect(moment(claim.DateOfJourney).format('DD/MM/YYYY')).to.equal(claimHelper.DATE_OF_JOURNEY.format('DD/MM/YYYY'))
        expect(claim.DateSubmitted).to.be.equal(null)
        expect(claim.Status).to.equal(claimHelper.STATUS)
      })
  })

  it('should throw an error if passed a non-expense object.', function () {
    return expect(function () {
      insertNewClaim(REFERENCE, eligibilityId, CLAIM_TYPE, {})
    }).to.throw(Error)
  })

  after(function () {
    return eligiblityHelper.deleteAll(REFERENCE)
  })
})
