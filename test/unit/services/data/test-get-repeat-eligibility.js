var expect = require('chai').expect
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')

const MASKED_ELIGIBILITY = {EligibilityId: '1', FirstName: 'Bo*', EmailAddress: 'test@test.com', PhoneNumber: '87654321'}
const UPDATE_CONTACT_DETAILS = {EmailAddress: 'forTesting@test.com', PhoneNumber: '12345678'}
const REFERENCE = 'V123456'
const ELIGIBILITYID = null
const DOB = '10-10-1990'

describe('services/data/get-repeat-eligibility', function () {
  var getRepeatEligibility
  var getMaskedEligibilityStub
  var getEligibilityVisitorUpdateContactDetailStub

  before(function () {
    getMaskedEligibilityStub = sinon.stub()
    getEligibilityVisitorUpdateContactDetailStub = sinon.stub()

    getRepeatEligibility = proxyquire('../../../../app/services/data/get-repeat-eligibility', {
      './get-masked-eligibility': getMaskedEligibilityStub,
      './get-eligibility-visitor-updated-contact-detail': getEligibilityVisitorUpdateContactDetailStub
    })
  })

  it('should return contact details from updated contact', function () {
    getMaskedEligibilityStub.resolves(MASKED_ELIGIBILITY)
    getEligibilityVisitorUpdateContactDetailStub.resolves(UPDATE_CONTACT_DETAILS)
    return getRepeatEligibility(REFERENCE, DOB, ELIGIBILITYID)
      .then(function (result) {
        expect(getMaskedEligibilityStub.calledWith(REFERENCE, DOB, ELIGIBILITYID)).to.be.true
        expect(getEligibilityVisitorUpdateContactDetailStub.calledWith(REFERENCE, MASKED_ELIGIBILITY.EligibilityId)).to.be.true

        expect(result.EmailAddress).to.equal(UPDATE_CONTACT_DETAILS.EmailAddress)
        expect(result.PhoneNumber).to.equal(UPDATE_CONTACT_DETAILS.PhoneNumber)
        expect(result.FirstName).to.equal(MASKED_ELIGIBILITY.FirstName)
      })
  })

  it('should return contact details from the maskeed eligibility', function () {
    getMaskedEligibilityStub.resolves(MASKED_ELIGIBILITY)
    getEligibilityVisitorUpdateContactDetailStub.resolves({})
    return getRepeatEligibility(REFERENCE, DOB, ELIGIBILITYID)
      .then(function (result) {
        expect(getMaskedEligibilityStub.calledWith(REFERENCE, DOB, ELIGIBILITYID)).to.be.true
        expect(getEligibilityVisitorUpdateContactDetailStub.calledWith(REFERENCE, MASKED_ELIGIBILITY.EligibilityId)).to.be.true

        expect(result.EmailAddress).to.equal(MASKED_ELIGIBILITY.EmailAddress)
        expect(result.PhoneNumber).to.equal(MASKED_ELIGIBILITY.PhoneNumber)
        expect(result.FirstName).to.equal(MASKED_ELIGIBILITY.FirstName)
      })
  })
})
