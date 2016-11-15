const expect = require('chai').expect
const claimStatusHelper = require('../../../../app/views/helpers/claim-status-helper')
const claimDecisionEnum = require('../../../../app/constants/claim-decision-enum')

describe('views/child-helper', function () {
  const APPROVED = claimDecisionEnum['APPROVED']
  const REQUEST_INFORMATION = claimDecisionEnum['REQUEST_INFORMATION']
  const REJECTED = claimDecisionEnum['REJECTED']
  const NEW = claimDecisionEnum['NEW']
  const NON_MATCHING = ''

  it(`should return the expected value when passed ${APPROVED}`, function () {
    expect(claimStatusHelper(APPROVED)).to.equal('Approved')
  })

  it(`should return the expected value when passed ${REQUEST_INFORMATION}`, function () {
    expect(claimStatusHelper(REQUEST_INFORMATION)).to.equal('Information Requested')
  })

  it(`should return the expected value when passed ${REJECTED}`, function () {
    expect(claimStatusHelper(REJECTED)).to.equal('Rejected')
  })

  it(`should return the expected value when passed ${NEW}`, function () {
    expect(claimStatusHelper(NEW)).to.equal('In Progress')
  })

  it(`should return the original input if passed a non-matching value`, function () {
    expect(claimStatusHelper(NON_MATCHING)).to.equal(NON_MATCHING)
  })
})
