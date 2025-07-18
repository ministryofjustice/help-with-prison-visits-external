const { expect } = require('chai')
const eligibilityVisitorUpdateContactDetailHelper = require('../../../helpers/data/eligibility-visitor-update-contact-detail-helper')
const getEligibilityVisitorUpdateContactDetail = require('../../../../app/services/data/get-eligibility-visitor-updated-contact-detail')

describe('services/data/insert-eligibility-visitor-updated-contact-detail', () => {
  const REFERENCE = 'V123456'
  const ELIGIBILITY_ID = '1'

  before(() => {
    return eligibilityVisitorUpdateContactDetailHelper.insert(REFERENCE, ELIGIBILITY_ID)
  })

  it('should retrieve updated contact details for a reference and eligibility id', () => {
    return getEligibilityVisitorUpdateContactDetail(REFERENCE, ELIGIBILITY_ID).then(contactDetails => {
      expect(contactDetails.EmailAddress).to.equal(eligibilityVisitorUpdateContactDetailHelper.EMAIL_ADDRESS)
      expect(contactDetails.PhoneNumber).to.equal(eligibilityVisitorUpdateContactDetailHelper.PHONE_NUMBER)
    })
  })

  after(() => {
    return eligibilityVisitorUpdateContactDetailHelper.delete(REFERENCE)
  })
})
