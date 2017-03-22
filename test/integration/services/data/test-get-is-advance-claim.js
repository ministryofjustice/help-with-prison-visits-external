const expect = require('chai').expect
const getIsAdvanceClaim = require('../../../../app/services/data/get-is-advance-claim')
const eligibilityHelper = require('../../../helpers/data/eligibility-helper')
const claimHelper = require('../../../helpers/data/claim-helper')

describe('services/data/get-is-advance-claim', function () {
  const REFERENCE = 'ISADV12'
  var claimId

  before(function () {
    return eligibilityHelper.insertEligibilityClaim(REFERENCE)
      .then(function (ids) { claimId = ids.claimId })
  })

  after(function () {
    return eligibilityHelper.deleteAll(REFERENCE)
  })

  it('should retrieve the isAdvanceClaim field for the given claimId', function () {
    return getIsAdvanceClaim(claimId)
      .then(function (result) {
        expect(result).to.equal(claimHelper.IS_ADVANCE_CLAIM)
      })
  })
})
