const expect = require('chai').expect
const getClaimChildrenByIdOrLastApproved = require('../../../../app/services/data/get-claim-children-by-id-or-last-approved')
const internalEligiblityHelper = require('../../../helpers/data/internal/internal-eligibility-helper')
const internalClaimChildHelper = require('../../../helpers/data/internal/internal-claim-child-helper')

describe('services/data/get-last-claim-children', function () {
  const REFERENCE = 'MASK467'
  const INVALID_REFERENCE = 'INVALID'
  let eligibilityId
  let claimId

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

  it('should retrieve last claim children given reference and eligibilityId', function () {
    return getClaimChildrenByIdOrLastApproved(REFERENCE, eligibilityId, null, false)
      .then(function (children) {
        expect(children.length).to.be.equal(1)
        expect(children[0].Name).to.be.equal(internalClaimChildHelper.CHILD_NAME)
      })
  })

  it('should retrieve last claim children given reference and claimId', function () {
    return getClaimChildrenByIdOrLastApproved(REFERENCE, null, claimId, false)
      .then(function (children) {
        expect(children.length).to.be.equal(1)
        expect(children[0].Name).to.be.equal(internalClaimChildHelper.CHILD_NAME)
      })
  })

  it('should return empty for an invalid reference and eligibilityId', function () {
    return getClaimChildrenByIdOrLastApproved(INVALID_REFERENCE, '1234', null, false)
      .then(function (children) {
        expect(children.length).to.be.equal(0)
      })
  })
})
