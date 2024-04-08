const MASKED_ELIGIBILITY = { EligibilityId: '1', FirstName: 'Bo*', EmailAddress: 'test@test.com', PhoneNumber: '87654321' }
const UPDATE_CONTACT_DETAILS = { EmailAddress: 'forTesting@test.com', PhoneNumber: '12345678' }
const REFERENCE = 'V123456'
const ELIGIBILITYID = null
const DOB = '10-10-1990'

describe('services/data/get-repeat-eligibility', function () {
  let mockGetRepeatEligibility
  const mockGetMaskedEligibility = jest.fn()
  const mockGetEligibilityVisitorUpdateContactDetail = jest.fn()

  beforeEach(function () {
    jest.mock('../../../../app/services/data/get-masked-eligibility', () => mockGetMaskedEligibility)
    jest.mock(
      '../../../../app/services/data/get-eligibility-visitor-updated-contact-detail',
      () => mockGetEligibilityVisitorUpdateContactDetail
    )

    mockGetRepeatEligibility = require('../../../../app/services/data/get-repeat-eligibility')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should return contact details from updated contact', function () {
    mockGetMaskedEligibility.mockResolvedValue(MASKED_ELIGIBILITY)
    mockGetEligibilityVisitorUpdateContactDetail.mockResolvedValue(UPDATE_CONTACT_DETAILS)
    return mockGetRepeatEligibility(REFERENCE, DOB, ELIGIBILITYID)
      .then(function (result) {
        expect(mockGetMaskedEligibility).toHaveBeenCalledWith(REFERENCE, DOB, ELIGIBILITYID)  //eslint-disable-line
        expect(mockGetEligibilityVisitorUpdateContactDetail).toHaveBeenCalledWith(REFERENCE, MASKED_ELIGIBILITY.EligibilityId)  //eslint-disable-line

        expect(result.EmailAddress).toBe(UPDATE_CONTACT_DETAILS.EmailAddress)
        expect(result.PhoneNumber).toBe(UPDATE_CONTACT_DETAILS.PhoneNumber)
        expect(result.FirstName).toBe(MASKED_ELIGIBILITY.FirstName)
      })
  })

  it('should return contact details from the maskeed eligibility', function () {
    mockGetMaskedEligibility.mockResolvedValue(MASKED_ELIGIBILITY)
    mockGetEligibilityVisitorUpdateContactDetail.mockResolvedValue({})
    return mockGetRepeatEligibility(REFERENCE, DOB, ELIGIBILITYID)
      .then(function (result) {
        expect(mockGetMaskedEligibility).toHaveBeenCalledWith(REFERENCE, DOB, ELIGIBILITYID)  //eslint-disable-line
        expect(mockGetEligibilityVisitorUpdateContactDetail).toHaveBeenCalledWith(REFERENCE, MASKED_ELIGIBILITY.EligibilityId)  //eslint-disable-line

        expect(result.EmailAddress).toBe(MASKED_ELIGIBILITY.EmailAddress)
        expect(result.PhoneNumber).toBe(MASKED_ELIGIBILITY.PhoneNumber)
        expect(result.FirstName).toBe(MASKED_ELIGIBILITY.FirstName)
      })
  })
})
