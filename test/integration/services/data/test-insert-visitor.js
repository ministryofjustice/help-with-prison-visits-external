const expect = require('chai').expect
const moment = require('moment')
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const visitorHelper = require('../../../helpers/data/visitor-helper')
const insertVisitor = require('../../../../app/services/data/insert-visitor')

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
        expect(visitor.Reference).to.equal(REFERENCE)
        expect(visitor.FirstName).to.equal(visitorHelper.FIRST_NAME)
        expect(visitor.LastName).to.equal(visitorHelper.LAST_NAME)
        expect(visitor.NationalInsuranceNumber).to.equal(visitorHelper.NATIONAL_INSURANCE_NUMBER)
        expect(visitor.DateOfBirth).to.be.within(
          moment(visitorHelper.DATE_OF_BIRTH).subtract(1, 'seconds').toDate(),
          moment(visitorHelper.DATE_OF_BIRTH).add(1, 'seconds').toDate()
        )
        expect(visitor.PostCode).to.equal(visitorHelper.POST_CODE)
        expect(visitor.Benefit).to.equal(visitorHelper.BENEFIT)
        expect(visitor.RequireBenefitUpload, 'should set RequireBenefitUpload based on benefit').to.be.false
      })
  })

  it('should throw an error if passed a non visitor object.', function () {
    return expect(function () {
      insertVisitor({})
    }).to.throw(Error)
  })

  after(function () {
    return visitorHelper.delete(REFERENCE)
      .then(function () {
        return eligiblityHelper.delete(REFERENCE)
      })
  })
})
