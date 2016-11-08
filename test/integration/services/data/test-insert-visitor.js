const expect = require('chai').expect
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const visitorHelper = require('../../../helpers/data/visitor-helper')
const insertVisitor = require('../../../../app/services/data/insert-visitor')
const dateFormatter = require('../../../../app/services/date-formatter')

describe('services/data/insert-visitor', function () {
  var REFERENCE = 'V123456'

  before(function () {
    return eligiblityHelper.insert(REFERENCE)
  })

  it('should insert a new Visitor for a reference', function () {
    return insertVisitor(REFERENCE, visitorHelper.build())
      .then(function () {
        return visitorHelper.get(REFERENCE)
      })
      .then(function (visitor) {
        var dateExpected = dateFormatter.buildFromDateString(visitorHelper.DATE_OF_BIRTH)

        expect(visitor.Reference).to.equal(REFERENCE)
        expect(visitor.FirstName).to.equal(visitorHelper.FIRST_NAME)
        expect(visitor.LastName).to.equal(visitorHelper.LAST_NAME)
        expect(visitor.NationalInsuranceNumber).to.equal(visitorHelper.NATIONAL_INSURANCE_NUMBER)
        expect(visitor.DateOfBirth).to.deep.equal(dateExpected.toDate())
        expect(visitor.PostCode).to.equal(visitorHelper.POST_CODE)
        expect(visitor.Benefit).to.equal(visitorHelper.BENEFIT)
        expect(visitor.RequireBenefitUpload, 'should set RequireBenefitUpload based on benefit').to.be.false
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
    var dateExpected = dateFormatter.buildFromDateString('1990-10-12')
    var visitorInserted = visitorHelper.build()
    visitorInserted.dob = dateExpected

    return insertVisitor(REFERENCE, visitorInserted)
      .then(function () {
        return visitorHelper.get(REFERENCE)
      })
      .then(function (visitorReturned) {
        expect(visitorReturned.DateOfBirth).to.deep.equal(dateExpected.toDate())
      })
  })

  after(function () {
    return visitorHelper.delete(REFERENCE)
      .then(function () {
        return eligiblityHelper.delete(REFERENCE)
      })
  })
})
