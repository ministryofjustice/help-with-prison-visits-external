const expect = require('chai').expect
const getClaimsWithReference = require('../../../../app/services/data/get-historic-claims')
const internalEligiblityHelper = require('../../../helpers/data/internal/internal-eligibility-helper')
const internalClaimHelper = require('../../../helpers/data/internal/internal-claim-helper')
const internalVisitorHelper = require('../../../helpers/data/internal/internal-visitor-helper')

describe('services/data/get-historic-claims', function () {
  const REFERENCE = 'V123467'
  var claimId

  before(function () {
    return internalEligiblityHelper.insertEligibilityAndClaim(REFERENCE)
      .then(function (ids) { claimId = ids.claimId })
  })

  after(function () {
    return internalEligiblityHelper.deleteAll(REFERENCE)
  })

  it('should retrieve all claims with the given reference', function () {
    return getClaimsWithReference(REFERENCE, internalVisitorHelper.DATE_OF_BIRTH)
      .then(function (claims) {
        expect(claims[0].ClaimId).to.equal(claimId)
        expect(claims[0].DateOfJourney).to.deep.equal(internalClaimHelper.DATE_OF_JOURNEY.toDate())
        expect(claims[0].Status).to.equal(internalClaimHelper.STATUS)
        expect(claims[0].DateOfBirth).to.deep.equal(internalVisitorHelper.DATE_OF_BIRTH.toDate())
      })
  })
})
