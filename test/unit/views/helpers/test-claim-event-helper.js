const claimEventHelper = require('../../../../app/views/helpers/claim-event-helper')

describe('views/helpers/claim-event-helper', function () {
  const APPROVED = 'CLAIM-APPROVED'
  const REQUEST_INFORMATION = 'CLAIM-REQUEST-INFORMATION'
  const REJECTED = 'CLAIM-REJECTED'
  const REQUESTED = 'CLAIM-REQUEST-INFORMATION'
  const CONTACT = 'UPDATED-CONTACT-DETAILS'
  const NON_MATCHING = ''

  it(`should return the expected value when passed ${APPROVED}`, function () {
    expect(claimEventHelper(APPROVED)).toBe('Claim approved')
  })

  it(`should return the expected value when passed ${REQUEST_INFORMATION}`, function () {
    expect(claimEventHelper(REQUEST_INFORMATION)).toBe('Requested Information')
  })

  it(`should return the expected value when passed ${REJECTED}`, function () {
    expect(claimEventHelper(REJECTED)).toBe('Claim rejected')
  })

  it(`should return the expected value when passed ${REQUESTED}`, function () {
    expect(claimEventHelper(REQUESTED)).toBe('Requested Information')
  })

  it(`should return the expected value when passed ${CONTACT}`, function () {
    expect(claimEventHelper(CONTACT)).toBe('Contact details updated')
  })

  it('should return the original input if passed a non-matching value', function () {
    expect(claimEventHelper(NON_MATCHING)).toBe(NON_MATCHING)
  })
})
