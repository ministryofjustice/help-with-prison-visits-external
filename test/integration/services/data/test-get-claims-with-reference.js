const expect = require('chai').expect
const getClaimsWithReference = require('../../../../app/services/data/get-claims-with-reference')
const internalEligiblityHelper = require('../../../helpers/data/internal/internal-eligibility-helper')
const internalClaimHelper = require('../../../helpers/data/internal/internal-claim-helper')

describe('services/data/get-claims-with-reference', function () {
  const REFERENCE = 'V123467'
  var claimId

  beforeEach(function () {
    return internalEligiblityHelper.insertEligibilityAndClaim(REFERENCE)
      .then(function (ids) {
        claimId = ids.claimId
      })
  })

  afterEach(function () {
    return internalEligiblityHelper.deleteAll(REFERENCE)
  })

  it('should retrieve all claims with the given reference', function () {
    return getClaimsWithReference(REFERENCE)
      .then(function (claims) {
        expect(claims[0].ClaimId).to.equal(claimId)
        expect(claims[0].DateOfJourney).to.deep.equal(internalClaimHelper.DATE_OF_JOURNEY.toDate())
        expect(claims[0].Status).to.equal(internalClaimHelper.STATUS)
      })
  })
})
