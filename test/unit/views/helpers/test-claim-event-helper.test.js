const claimEventHelper = require('../../../../app/views/helpers/claim-event-helper')

describe('views/helpers/claim-event-helper', () => {
  const APPROVED = 'CLAIM-APPROVED'
  const REQUEST_INFORMATION = 'CLAIM-REQUEST-INFORMATION'
  const REJECTED = 'CLAIM-REJECTED'
  const REQUESTED = 'CLAIM-REQUEST-INFORMATION'
  const CONTACT = 'UPDATED-CONTACT-DETAILS'
  const NON_MATCHING = ''

  it(`should return the expected value when passed ${APPROVED}`, () => {
    expect(claimEventHelper(APPROVED)).toBe('Claim approved')
  })

  it(`should return the expected value when passed ${REQUEST_INFORMATION}`, () => {
    expect(claimEventHelper(REQUEST_INFORMATION)).toBe('Requested Information')
  })

  it(`should return the expected value when passed ${REJECTED}`, () => {
    expect(claimEventHelper(REJECTED)).toBe('Claim rejected')
  })

  it(`should return the expected value when passed ${REQUESTED}`, () => {
    expect(claimEventHelper(REQUESTED)).toBe('Requested Information')
  })

  it(`should return the expected value when passed ${CONTACT}`, () => {
    expect(claimEventHelper(CONTACT)).toBe('Contact details updated')
  })

  it('should return the original input if passed a non-matching value', () => {
    expect(claimEventHelper(NON_MATCHING)).toBe(NON_MATCHING)
  })
})
