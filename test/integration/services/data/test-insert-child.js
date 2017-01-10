const expect = require('chai').expect
const insertChild = require('../../../../app/services/data/insert-child')
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const claimChildHelper = require('../../../helpers/data/claim-child-helper')

describe('services/data/insert-child', function () {
  const REFERENCE = 'V123467'
  var eligibilityId
  var claimId

  before(function () {
    return eligiblityHelper.insertEligibilityClaim(REFERENCE)
      .then(function (ids) {
        eligibilityId = ids.eligibilityId
        claimId = ids.claimId
      })
  })

  it('should insert a new child', function () {
    return insertChild(REFERENCE, eligibilityId, claimId, claimChildHelper.build())
      .then(function () {
        return claimChildHelper.get(claimId)
      })
      .then(function (child) {
        expect(child.EligibilityId).to.equal(eligibilityId)
        expect(child.Reference).to.equal(REFERENCE)
        expect(child.ClaimId).to.equal(claimId)
        expect(child.FirstName).to.equal(claimChildHelper.FIRST_NAME)
        expect(child.LastName).to.equal(claimChildHelper.LAST_NAME)
        expect(child.DateOfBirth).to.be.within(
          claimChildHelper.DOB.subtract(1, 'seconds').toDate(),
          claimChildHelper.DOB.add(1, 'seconds').toDate()
        )
        expect(child.Relationship).to.equal(claimChildHelper.CHILD_RELATIONSHIP)
      })
  })

  it('should throw an error if passed a non-AboutChild object.', function () {
    return expect(function () {
      insertChild(REFERENCE, eligibilityId, claimId, {})
    }).to.throw(Error)
  })

  after(function () {
    return eligiblityHelper.deleteAll(REFERENCE)
  })
})
