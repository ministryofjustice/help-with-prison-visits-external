const expect = require('chai').expect
const claimStatusHelper = require('../../../../app/views/helpers/claim-status-helper')
const claimDecisionEnum = require('../../../../app/constants/claim-decision-enum')

describe('views/helpers/claim-status-helper', function () {
  const APPROVED = claimDecisionEnum['APPROVED']
  const APPROVED_DIFF_AMOUNT = claimDecisionEnum['APPROVED-DIFF-AMOUNT']
  const REQUEST_INFORMATION = claimDecisionEnum['REQUEST-INFORMATION']
  const REJECTED = claimDecisionEnum['REJECTED']
  const NEW = claimDecisionEnum['NEW']
  const NON_MATCHING = ''

  it(`should return the expected value when passed ${APPROVED}`, function () {
    expect(claimStatusHelper('APPROVED')).to.equal('Approved')
  })

  it(`should return the expected value when passed ${APPROVED_DIFF_AMOUNT}`, function () {
    expect(claimStatusHelper('APPROVED-DIFF-AMOUNT')).to.equal('Approved')
  })

  it(`should return the expected value when passed ${REQUEST_INFORMATION}`, function () {
    expect(claimStatusHelper('REQUEST-INFORMATION')).to.equal('Information requested')
  })

  it(`should return the expected value when passed ${REJECTED}`, function () {
    expect(claimStatusHelper('REJECTED')).to.equal('Rejected')
  })

  it(`should return the expected value when passed ${NEW}`, function () {
    expect(claimStatusHelper('NEW')).to.equal('In progress')
  })

  it(`should return the original input if passed a non-matching value`, function () {
    expect(claimStatusHelper(NON_MATCHING)).to.equal(NON_MATCHING)
  })
})
