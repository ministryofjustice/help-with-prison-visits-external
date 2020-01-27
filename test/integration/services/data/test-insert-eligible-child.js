const expect = require('chai').expect
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const eligibleChildHelper = require('../../../helpers/data/eligible-child-helper')
const insertEligibleChild = require('../../../../app/services/data/insert-eligible-child')
const dateFormatter = require('../../../../app/services/date-formatter')

describe('services/data/insert-eligible-child', function () {
  var REFERENCE = 'V123456'
  var eligibilityId

  before(function () {
    return eligiblityHelper.insert(REFERENCE)
      .then(function (newEligibilityId) {
        eligibilityId = newEligibilityId
      })
  })

  it('should insert a new Eligible Child for a reference', function () {
    var eligibleChildInserted = eligibleChildHelper.build()
    return insertEligibleChild(eligibleChildInserted, REFERENCE, eligibilityId)
      .then(function () {
        return eligibleChildHelper.get(REFERENCE)
      })
      .then(function (eligibleChild) {
        expect(eligibleChild.EligibilityId).to.equal(eligibilityId)
        expect(eligibleChild.Reference).to.equal(REFERENCE)
        expect(eligibleChild.FirstName).to.equal(eligibleChildHelper.FIRST_NAME)
        expect(eligibleChild.LastName).to.equal(eligibleChildHelper.LAST_NAME)
        expect(eligibleChild.ChildRelationship).to.equal(eligibleChildHelper.CHILD_RELATIONSHIP)
        expect(eligibleChild.DateOfBirth).to.deep.equal(eligibleChildInserted.dob.toDate())
        expect(eligibleChild.ParentFirstName).to.equal(eligibleChildHelper.PARENT_FIRST_NAME)
        expect(eligibleChild.ParentLastName).to.equal(eligibleChildHelper.PARENT_LAST_NAME)
        expect(eligibleChild.HouseNumberAndStreet).to.equal(eligibleChildHelper.HOUSE_NUMBER_AND_STREET)
        expect(eligibleChild.Town).to.equal(eligibleChildHelper.TOWN)
        expect(eligibleChild.County).to.equal(eligibleChildHelper.COUNTY)
        expect(eligibleChild.Postcode).to.equal(eligibleChildHelper.POST_CODE)
        expect(eligibleChild.Country).to.equal(eligibleChildHelper.COUNTRY)
      })
      .then(function () {
        return eligibleChildHelper.delete(REFERENCE)
      })
  })

  it('should throw an error if passed a non eligible child object.', function () {
    return expect(function () {
      insertEligibleChild({}, REFERENCE)
    }).to.throw(Error)
  })

  it('should handle daylight saving time when storing eligible child DOB', function () {
    var dateExpected = dateFormatter.buildFromDateString('2020-10-12')
    var eligibleChildInserted = eligibleChildHelper.build()
    eligibleChildInserted.dob = dateExpected

    return insertEligibleChild(eligibleChildInserted, REFERENCE, eligibilityId)
      .then(function () {
        return eligibleChildHelper.get(REFERENCE)
      })
      .then(function (eligibleChild) {
        expect(eligibleChild.DateOfBirth).to.deep.equal(dateExpected.toDate())
      })
  })

  after(function () {
    return eligiblityHelper.deleteAll(REFERENCE)
  })
})
