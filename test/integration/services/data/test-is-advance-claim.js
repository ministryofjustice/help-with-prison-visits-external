const expect = require('chai').expect
const isAdvanceClaim = require('../../../../app/services/data/is-advance-claim')
const eligibilityHelper = require('../../../helpers/data/eligibility-helper')
const claimHelper = require('../../../helpers/data/claim-helper')

describe('services/data/get-historic-claim-by-claim-id', function () {
  const REFERENCE = 'ISADV12'
  var claimId

  before(function () {
    return eligibilityHelper.insertEligibilityClaim(REFERENCE)
      .then(function (ids) { claimId = ids.claimId })
  })

  after(function () {
    return eligibilityHelper.deleteAll(REFERENCE)
  })

  it('should retrieve the isAdvance field for the given claimId', function () {
    return isAdvanceClaim(claimId)
      .then(function (claim) {
        expect(claim.IsAdvanceClaim).to.equal(claimHelper.IS_ADVANCE_CLAIM)
      })
  })
})
