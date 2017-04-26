const expect = require('chai').expect
const duplicateClaimCheck = require('../../../../app/services/data/duplicate-claim-check')
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const internalEligiblityHelper = require('../../../helpers/data/internal/internal-eligibility-helper')

describe('services/data/duplicate-claim-check', function () {
  const EXT_REFERENCE = 'DUPCHKE'
  const INT_REFERENCE = 'DUPCHKI'

  var eligibilityId
  var sameNationalInsuranceNumber = 'BN180518D'
  var diffNationalInsuranceNumber = 'DIFF0518D'

  before(function () {
    return eligiblityHelper.insertEligibilityVisitorAndPrisoner(EXT_REFERENCE)
    .then(function (newEligibilityId) {
      eligibilityId = newEligibilityId

      return internalEligiblityHelper.insertEligibilityAndClaim(INT_REFERENCE)
    })
  })

  after(function () {
    return eligiblityHelper.deleteAll(EXT_REFERENCE)
    .then(function () {
      return internalEligiblityHelper.deleteAll(INT_REFERENCE)
    })
  })

  it('should return false when there is no existing claims with same prison number and national insurance number', function () {
    return duplicateClaimCheck(EXT_REFERENCE, eligibilityId, diffNationalInsuranceNumber)
      .then(function (result) {
        expect(result).to.be.false
      })
  })

  it('should return false when there is an existing claim with same prison number and national insurance number and same reference', function () {
    return duplicateClaimCheck(INT_REFERENCE, eligibilityId, sameNationalInsuranceNumber)
      .then(function (result) {
        expect(result).to.be.false
      })
  })

  it('should return true when there is an existing claim with same prison number and national insurance number and different reference', function () {
    return duplicateClaimCheck(EXT_REFERENCE, eligibilityId, sameNationalInsuranceNumber)
      .then(function (result) {
        expect(result).to.be.true
      })
  })
})
