const expect = require('chai').expect
const insertEscort = require('../../../../app/services/data/insert-escort')
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const claimEscortHelper = require('../../../helpers/data/claim-escort-helper')

describe('services/data/insert-escort', function () {
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

  it('should insert a new escort', function () {
    return insertEscort(REFERENCE, eligibilityId, claimId, claimEscortHelper.build())
      .then(function () {
        return claimEscortHelper.get(claimId)
      })
      .then(function (escort) {
        expect(escort.EligibilityId).to.equal(eligibilityId)
        expect(escort.Reference).to.equal(REFERENCE)
        expect(escort.ClaimId).to.equal(claimId)
        expect(escort.FirstName).to.equal(claimEscortHelper.FIRST_NAME)
        expect(escort.LastName).to.equal(claimEscortHelper.LAST_NAME)
        expect(escort.DateOfBirth).to.be.within(
          claimEscortHelper.DOB.subtract(1, 'seconds').toDate(),
          claimEscortHelper.DOB.add(1, 'seconds').toDate()
        )
        expect(escort.NationalInsuranceNumber).to.equal(claimEscortHelper.NATIONAL_INSURANCE_NUMBER)
      })
  })

  it('should throw an error if passed a non-AboutEscort object.', function () {
    return expect(function () {
      insertEscort(REFERENCE, eligibilityId, claimId, {})
    }).to.throw(Error)
  })

  after(function () {
    return eligiblityHelper.deleteAll(REFERENCE)
  })
})