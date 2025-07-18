/* eslint-disable no-new */
const UpdatedContactDetails = require('../../../../app/services/domain/updated-contact-details')

describe('services/domain/update-contact-details', () => {
  const VALID_EMAIL = 'test@test.com'
  const VALID_PHONE_NUMBER = '02121 565 654'

  it('should construct a domain object given valid input', () => {
    const updatedContactDetails = new UpdatedContactDetails(VALID_EMAIL, VALID_PHONE_NUMBER)
    expect(updatedContactDetails.emailAddress).toBe(VALID_EMAIL)
    expect(updatedContactDetails.phoneNumber).toBe(VALID_PHONE_NUMBER)
  })

  it('should throw a validation error if any inputs were not set and the default domain object values where used', () => {
    expect(() => {
      new UpdatedContactDetails()
    }).toThrow()
  })
})
