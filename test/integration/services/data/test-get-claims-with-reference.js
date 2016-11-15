const expect = require('chai').expect
const getClaimsWithReference = require('../../../../app/services/data/get-claims-with-reference')
const internalEligiblityHelper = require('../../../helpers/data/internal/internal-eligibility-helper')
const internalClaimHelper = require('../../../helpers/data/internal/internal-claim-helper')

describe('services/data/get-claims-with-reference', function () {
  const REFERENCE = 'V123467'
  var eligibilityId
  var claimId

  before(function () {
    return internalEligiblityHelper.insertEligibilityAndClaim(REFERENCE)
      .then(function (ids) {
        eligibilityId = ids.eligibilityId
        claimId = ids.claimId
      })
  })

  after(function () {
    return internalEligiblityHelper.deleteAll(REFERENCE)
  })

  it('should retrieve all claims with the given reference', function () {
    return getClaimsWithReference(REFERENCE)
      .then(function (claims) {
        expect(claims[0].ClaimId).to.equal(claimId)
        expect(claims[0].EligibilityId).to.equal(eligibilityId)
        expect(claims[0].Reference).to.equal(REFERENCE)
        expect(claims[0].DateOfJourney).to.deep.equal(internalClaimHelper.DATE_OF_JOURNEY.toDate())
        expect(claims[0].DateCreated).to.be.within(
          internalClaimHelper.DATE_CREATED.subtract(1, 'seconds').toDate(),
          internalClaimHelper.DATE_CREATED.add(1, 'seconds').toDate()
        )
        expect(claims[0].DateSubmitted).to.be.within(
          internalClaimHelper.DATE_SUBMITTED.subtract(1, 'seconds').toDate(),
          internalClaimHelper.DATE_SUBMITTED.add(1, 'seconds').toDate()
        )
        expect(claims[0].Status).to.equal(internalClaimHelper.STATUS)
        expect(claims[0].Reason).to.equal(internalClaimHelper.REASON)
        expect(claims[0].Note).to.equal(internalClaimHelper.NOTE)
      })
  })
})
