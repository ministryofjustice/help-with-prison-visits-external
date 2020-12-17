const expect = require('chai').expect
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const visitorHelper = require('../../../helpers/data/visitor-helper')
const insertVisitor = require('../../../../app/services/data/insert-visitor')
const dateFormatter = require('../../../../app/services/date-formatter')

describe('services/data/insert-visitor', function () {
  const REFERENCE = 'V123456'
  let eligibilityId

  before(function () {
    return eligiblityHelper.insert(REFERENCE)
      .then(function (newEligibilityId) {
        eligibilityId = newEligibilityId
      })
  })

  it('should insert a new Visitor for a reference', function () {
    const visitorInserted = visitorHelper.build()
    return insertVisitor(REFERENCE, eligibilityId, visitorInserted)
      .then(function () {
        return visitorHelper.get(REFERENCE)
      })
      .then(function (visitor) {
        expect(visitor.EligibilityId).to.equal(eligibilityId)
        expect(visitor.Reference).to.equal(REFERENCE)
        expect(visitor.FirstName).to.equal(visitorHelper.FIRST_NAME)
        expect(visitor.LastName).to.equal(visitorHelper.LAST_NAME)
        expect(visitor.NationalInsuranceNumber).to.equal(visitorHelper.NATIONAL_INSURANCE_NUMBER)
        expect(visitor.DateOfBirth).to.deep.equal(visitorInserted.dob.toDate())
        expect(visitor.PostCode).to.equal(visitorHelper.POST_CODE)
        expect(visitor.Benefit).to.equal(visitorHelper.BENEFIT)
        expect(visitor.BenefitOwner).to.equal(visitorHelper.BENEFIT_OWNER)
      })
      .then(function () {
        return visitorHelper.delete(REFERENCE)
      })
  })

  it('should throw an error if passed a non visitor object.', function () {
    return expect(function () {
      insertVisitor(REFERENCE, {})
    }).to.throw(Error)
  })

  it('should handle daylight saving time when storing Visitor DOB', function () {
    const dateExpected = dateFormatter.buildFromDateString('1990-10-12')
    const visitorInserted = visitorHelper.build()
    visitorInserted.dob = dateExpected

    return insertVisitor(REFERENCE, eligibilityId, visitorInserted)
      .then(function () {
        return visitorHelper.get(REFERENCE)
      })
      .then(function (visitor) {
        expect(visitor.DateOfBirth).to.deep.equal(dateExpected.toDate())
      })
  })

  after(function () {
    return eligiblityHelper.deleteAll(REFERENCE)
  })
})
