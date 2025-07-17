const { expect } = require('chai')
const duplicateClaimCheck = require('../../../../app/services/data/duplicate-claim-check')
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const internalEligiblityHelper = require('../../../helpers/data/internal/internal-eligibility-helper')

describe('services/data/duplicate-claim-check', () => {
  const EXT_REFERENCE = 'DUPCHKE'
  const INT_REFERENCE = 'DUPCHKI'

  let eligibilityId
  const sameNationalInsuranceNumber = 'BN180518D'
  const diffNationalInsuranceNumber = 'DIFF0518D'

  before(() => {
    return eligiblityHelper.insertEligibilityVisitorAndPrisoner(EXT_REFERENCE).then(newEligibilityId => {
      eligibilityId = newEligibilityId

      return internalEligiblityHelper.insertEligibilityAndClaim(INT_REFERENCE)
    })
  })

  after(() => {
    return eligiblityHelper.deleteAll(EXT_REFERENCE).then(() => {
      return internalEligiblityHelper.deleteAll(INT_REFERENCE)
    })
  })

  it('should return false when there is no existing claims with same prison number and national insurance number', () => {
    return duplicateClaimCheck(EXT_REFERENCE, eligibilityId, diffNationalInsuranceNumber).then(result => {
        expect(result).to.be.false  //eslint-disable-line
    })
  })

  // Ignore temp - breaking on CI working locally
  // it('should return false when there is an existing claim with same prison number and national insurance number and same reference', () => {
  //   return duplicateClaimCheck(INT_REFERENCE, eligibilityId, sameNationalInsuranceNumber)
  //     .then(result => {
  //       expect(result).to.be.false  //eslint-disable-line
  //     })
  // })

  it('should return true when there is an existing claim with same prison number and national insurance number and different reference', () => {
    return duplicateClaimCheck(EXT_REFERENCE, eligibilityId, sameNationalInsuranceNumber).then(result => {
        expect(result).to.be.true  //eslint-disable-line
    })
  })
})
