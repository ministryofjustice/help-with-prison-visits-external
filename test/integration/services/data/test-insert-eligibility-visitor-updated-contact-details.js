const expect = require('chai').expect
const eligibilityVisitorUpdateContactDetailHelper = require('../../../helpers/data/eligibility-visitor-update-contact-detail-helper')
const insertEligibilityVisitorUpdateContactDetail = require('../../../../app/services/data/insert-eligibility-visitor-updated-contact-detail')

describe('services/data/insert-eligibility-visitor-updated-contact-detail', function () {
  const REFERENCE = 'V123456'
  const ELIGIBILITY_ID = '1'

  it('should insert updated contact details for a reference', function () {
    const updatedContactDetails = eligibilityVisitorUpdateContactDetailHelper.build()
    return insertEligibilityVisitorUpdateContactDetail(REFERENCE, ELIGIBILITY_ID, updatedContactDetails)
      .then(function () {
        return eligibilityVisitorUpdateContactDetailHelper.get(REFERENCE)
      })
      .then(function (contactDetails) {
        expect(contactDetails.EligibilityId).to.equal(parseInt(ELIGIBILITY_ID))
        expect(contactDetails.Reference).to.equal(REFERENCE)
        expect(contactDetails.EmailAddress).to.equal(eligibilityVisitorUpdateContactDetailHelper.EMAIL_ADDRESS)
        expect(contactDetails.PhoneNumber).to.equal(eligibilityVisitorUpdateContactDetailHelper.PHONE_NUMBER)
      })
  })

  it('should throw an error if passed a non visitor object.', function () {
    return expect(function () {
      insertEligibilityVisitorUpdateContactDetail(REFERENCE, ELIGIBILITY_ID, {})
    }).to.throw(Error)
  })

  after(function () {
    return eligibilityVisitorUpdateContactDetailHelper.delete(REFERENCE)
  })
})
