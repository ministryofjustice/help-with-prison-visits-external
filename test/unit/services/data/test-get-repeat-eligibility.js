const sinon = require('sinon')

const MASKED_ELIGIBILITY = { EligibilityId: '1', FirstName: 'Bo*', EmailAddress: 'test@test.com', PhoneNumber: '87654321' }
const UPDATE_CONTACT_DETAILS = { EmailAddress: 'forTesting@test.com', PhoneNumber: '12345678' }
const REFERENCE = 'V123456'
const ELIGIBILITYID = null
const DOB = '10-10-1990'

jest.mock('./get-masked-eligibility', () => mockGetMaskedEligibility)

jest.mock(
  './get-eligibility-visitor-updated-contact-detail',
  () => getEligibilityVisitorUpdateContactDetailStub
)

describe('services/data/get-repeat-eligibility', function () {
  let mockGetRepeatEligibility
  let mockGetMaskedEligibility
  let getEligibilityVisitorUpdateContactDetailStub

  beforeAll(function () {
    mockGetMaskedEligibility = jest.fn()
    getEligibilityVisitorUpdateContactDetailStub = jest.fn()

    mockGetRepeatEligibility = require('../../../../app/services/data/get-repeat-eligibility')
  })

  it('should return contact details from updated contact', function () {
    mockGetMaskedEligibility.mockResolvedValue(MASKED_ELIGIBILITY)
    getEligibilityVisitorUpdateContactDetailStub.mockResolvedValue(UPDATE_CONTACT_DETAILS)
    return mockGetRepeatEligibility(REFERENCE, DOB, ELIGIBILITYID)
      .then(function (result) {
        expect(mockGetMaskedEligibility.hasBeenCalledWith(REFERENCE, DOB, ELIGIBILITYID)).toBe(true)  //eslint-disable-line
        expect(getEligibilityVisitorUpdateContactDetailStub.hasBeenCalledWith(REFERENCE, MASKED_ELIGIBILITY.EligibilityId)).toBe(true)  //eslint-disable-line

        expect(result.EmailAddress).toBe(UPDATE_CONTACT_DETAILS.EmailAddress)
        expect(result.PhoneNumber).toBe(UPDATE_CONTACT_DETAILS.PhoneNumber)
        expect(result.FirstName).toBe(MASKED_ELIGIBILITY.FirstName)
      })
  })

  it('should return contact details from the maskeed eligibility', function () {
    mockGetMaskedEligibility.mockResolvedValue(MASKED_ELIGIBILITY)
    getEligibilityVisitorUpdateContactDetailStub.mockResolvedValue({})
    return mockGetRepeatEligibility(REFERENCE, DOB, ELIGIBILITYID)
      .then(function (result) {
        expect(mockGetMaskedEligibility.hasBeenCalledWith(REFERENCE, DOB, ELIGIBILITYID)).toBe(true)  //eslint-disable-line
        expect(getEligibilityVisitorUpdateContactDetailStub.hasBeenCalledWith(REFERENCE, MASKED_ELIGIBILITY.EligibilityId)).toBe(true)  //eslint-disable-line

        expect(result.EmailAddress).toBe(MASKED_ELIGIBILITY.EmailAddress)
        expect(result.PhoneNumber).toBe(MASKED_ELIGIBILITY.PhoneNumber)
        expect(result.FirstName).toBe(MASKED_ELIGIBILITY.FirstName)
      })
  })
})
