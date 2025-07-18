const claimStatusHelper = require('../../../../app/views/helpers/claim-status-helper')
const claimDecisionEnum = require('../../../../app/constants/claim-decision-enum')

describe('views/helpers/claim-status-helper', () => {
  const { APPROVED } = claimDecisionEnum
  const APPROVED_DIFF_AMOUNT = claimDecisionEnum['APPROVED-DIFF-AMOUNT']
  const REQUEST_INFORMATION = claimDecisionEnum['REQUEST-INFORMATION']
  const { REJECTED } = claimDecisionEnum
  const { NEW } = claimDecisionEnum
  const NON_MATCHING = ''

  it(`should return the expected value when passed ${APPROVED}`, () => {
    expect(claimStatusHelper('APPROVED')).toBe('Approved')
  })

  it(`should return the expected value when passed ${APPROVED_DIFF_AMOUNT}`, () => {
    expect(claimStatusHelper('APPROVED-DIFF-AMOUNT')).toBe('Approved')
  })

  it(`should return the expected value when passed ${REQUEST_INFORMATION}`, () => {
    expect(claimStatusHelper('REQUEST-INFORMATION')).toBe('Information requested')
  })

  it(`should return the expected value when passed ${REJECTED}`, () => {
    expect(claimStatusHelper('REJECTED')).toBe('Rejected')
  })

  it(`should return the expected value when passed ${NEW}`, () => {
    expect(claimStatusHelper('NEW')).toBe('In progress')
  })

  it('should return the original input if passed a non-matching value', () => {
    expect(claimStatusHelper(NON_MATCHING)).toBe(NON_MATCHING)
  })
})
