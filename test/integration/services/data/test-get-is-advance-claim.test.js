const { expect } = require('chai')
const getIsAdvanceClaim = require('../../../../app/services/data/get-is-advance-claim')
const eligibilityHelper = require('../../../helpers/data/eligibility-helper')
const claimHelper = require('../../../helpers/data/claim-helper')

describe('services/data/get-is-advance-claim', () => {
  const REFERENCE = 'ISADV12'
  let claimId

  before(() => {
    return eligibilityHelper.insertEligibilityClaim(REFERENCE).then(function (ids) {
      claimId = ids.claimId
    })
  })

  after(() => {
    return eligibilityHelper.deleteAll(REFERENCE)
  })

  it('should retrieve the isAdvanceClaim field for the given claimId', () => {
    return getIsAdvanceClaim(claimId).then(result => {
      expect(result).to.equal(claimHelper.IS_ADVANCE_CLAIM)
    })
  })
})
