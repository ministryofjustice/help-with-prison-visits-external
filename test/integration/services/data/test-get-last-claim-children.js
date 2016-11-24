const expect = require('chai').expect
const getLastClaimChildren = require('../../../../app/services/data/get-last-claim-children')
const internalEligiblityHelper = require('../../../helpers/data/internal/internal-eligibility-helper')
const internalClaimChildHelper = require('../../../helpers/data/internal/internal-claim-child-helper')

describe('services/data/get-last-claim-children', function () {
  const REFERENCE = 'MASK467'
  const INVALID_REFERENCE = 'INVALID'
  var eligibilityId

  before(function () {
    return internalEligiblityHelper.insertEligibilityAndClaim(REFERENCE)
      .then(function (ids) {
        eligibilityId = ids.eligibilityId
      })
  })

  after(function () {
    return internalEligiblityHelper.deleteAll(REFERENCE)
  })

  it('should retrieve last claim children given reference and eligibilityId', function () {
    return getLastClaimChildren(REFERENCE, eligibilityId)
      .then(function (children) {
        expect(children.length).to.be.equal(1)
        expect(children[0].Name).to.be.equal(internalClaimChildHelper.CHILD_NAME)
      })
  })

  it('should return empty for an invalid reference and eligibilityId', function () {
    return getLastClaimChildren(INVALID_REFERENCE, '1234')
      .then(function (children) {
        expect(children.length).to.be.equal(0)
      })
  })
})
