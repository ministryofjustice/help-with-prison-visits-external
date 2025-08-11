const { expect } = require('chai')
const getMaskedEligibility = require('../../../../app/services/data/get-masked-eligibility')
const internalEligiblityHelper = require('../../../helpers/data/internal/internal-eligibility-helper')
const internalVisitorHelper = require('../../../helpers/data/internal/internal-visitor-helper')
const internalPrisonerHelper = require('../../../helpers/data/internal/internal-prisoner-helper')

describe('services/data/get-masked-eligibility', () => {
  const REFERENCE = 'MASK467'
  const INVALID_REFERENCE = 'INVALID'
  let eligibilityId

  before(() => {
    return internalEligiblityHelper.insertEligibilityAndClaim(REFERENCE).then(function (ids) {
      eligibilityId = ids.eligibilityId
    })
  })

  after(() => {
    return internalEligiblityHelper.deleteAll(REFERENCE)
  })

  it('should retrieve eligibility data for the given reference and dob', () => {
    return getMaskedEligibility(REFERENCE, internalVisitorHelper.DATE_OF_BIRTH.format('YYYY-MM-DD'), null).then(
      eligibility => {
        expect(eligibility.EligibilityId).to.equal(eligibilityId)

        // Visitor Details
        expect(eligibility.FirstName).to.equal(internalVisitorHelper.FIRST_NAME)
        expect(eligibility.LastName, 'should be masked').to.equal('S****')
        expect(eligibility.PhoneNumber, 'should be masked').to.equal('******5564')

        // Prisoner Details
        expect(eligibility.PrisonerFirstName).to.equal(internalPrisonerHelper.FIRST_NAME)
        expect(eligibility.PrisonerLastName, 'should be masked').to.equal('S****')
        expect(eligibility.NameOfPrison).to.equal(internalPrisonerHelper.NAME_OF_PRISON)
        expect(eligibility.PrisonNumber).to.equal(internalPrisonerHelper.PRISON_NUMBER)
      },
    )
  })

  it('should retrieve eligibility data for the given reference and eligibilityId', () => {
    return getMaskedEligibility(REFERENCE, null, eligibilityId).then(eligibility => {
      expect(eligibility.EligibilityId).to.equal(eligibilityId)
    })
  })

  it('should throw an exception given an invalid reference and dob', () => {
    return getMaskedEligibility(INVALID_REFERENCE, internalVisitorHelper.DATE_OF_BIRTH.format('YYYY-MM-DD'))
      .then(() => {
        expect(false, 'should have throw error').to.be.true  //eslint-disable-line
      })
      .catch(error => {
        expect(error).not.to.be.null //eslint-disable-line
      })
  })
})
