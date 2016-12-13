const expect = require('chai').expect
const claimEventHelper = require('../../../../app/views/helpers/claim-event-helper')

describe('views/helpers/claim-event-helper', function () {
  const APPROVED = 'CLAIM-APPROVED'
  const REQUEST_INFORMATION = 'CLAIM-REQUEST-INFORMATION'
  const REJECTED = 'CLAIM-REJECTED'
  const NON_MATCHING = ''

  it(`should return the expected value when passed ${APPROVED}`, function () {
    expect(claimEventHelper(APPROVED)).to.equal('Claim approved')
  })

  it(`should return the expected value when passed ${REQUEST_INFORMATION}`, function () {
    expect(claimEventHelper(REQUEST_INFORMATION)).to.equal('Requested Information')
  })

  it(`should return the expected value when passed ${REJECTED}`, function () {
    expect(claimEventHelper(REJECTED)).to.equal('Claim rejected')
  })

  it(`should return the original input if passed a non-matching value`, function () {
    expect(claimEventHelper(NON_MATCHING)).to.equal(NON_MATCHING)
  })
})
