const expect = require('chai').expect
const insertChild = require('../../../../app/services/data/insert-child')
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const claimHelper = require('../../../helpers/data/claim-helper')
const claimChildHelper = require('../../../helpers/data/claim-child-helper')

describe('services/data/insert-child', function () {
  const REFERENCE = 'V123467'
  var claimId

  before(function () {
    return eligiblityHelper.insertEligibilityVisitorAndPrisoner(REFERENCE)
      .then(function () {
        return claimHelper.insert(REFERENCE)
      })
      .then(function (newClaimId) {
        claimId = newClaimId
      })
  })

  it('should insert a new child', function () {
    return insertChild(claimId, claimChildHelper.build())
      .then(function () {
        return claimChildHelper.get(claimId)
      })
      .then(function (child) {
        expect(child.ClaimId).to.equal(claimId)
        expect(child.Name).to.equal(claimChildHelper.CHILD_NAME)
        expect(child.DateOfBirth).to.be.within(
          claimChildHelper.DOB.subtract(1, 'seconds').toDate(),
          claimChildHelper.DOB.add(1, 'seconds').toDate()
        )
        expect(child.Relationship).to.equal(claimChildHelper.CHILD_RELATIONSHIP)
      })
  })

  it('should throw an error if passed a non-AboutChild object.', function () {
    return expect(function () {
      insertChild({})
    }).to.throw(Error)
  })

  after(function () {
    return claimChildHelper.delete(claimId)
      .then(function () {
        return claimHelper.delete(claimId)
      })
      .then(function () {
        return eligiblityHelper.deleteEligibilityVisitorAndPrisoner(REFERENCE)
      })
  })
})
