const { expect } = require('chai')
const getHistoricClaimByClaimId = require('../../../../app/services/data/get-historic-claim-by-claim-id')
const internalEligiblityHelper = require('../../../helpers/data/internal/internal-eligibility-helper')
const internalClaimHelper = require('../../../helpers/data/internal/internal-claim-helper')
const internalVisitorHelper = require('../../../helpers/data/internal/internal-visitor-helper')
const internalPrisonerHelper = require('../../../helpers/data/internal/internal-prisoner-helper')

describe('services/data/get-historic-claim-by-claim-id', () => {
  const REFERENCE = 'V123467'
  let claimId

  before(() => {
    return internalEligiblityHelper.insertEligibilityAndClaim(REFERENCE).then(function (ids) {
      claimId = ids.claimId
    })
  })

  after(() => {
    return internalEligiblityHelper.deleteAll(REFERENCE)
  })

  it('should retrieve claim with the given reference and dob and claimId', () => {
    return getHistoricClaimByClaimId(REFERENCE, internalVisitorHelper.DATE_OF_BIRTH.toDate(), claimId).then(
      claims => {
        // Claim Details
        expect(claims[0].DateOfJourney).to.deep.equal(internalClaimHelper.DATE_OF_JOURNEY.toDate())
        expect(claims[0].Status).to.equal(internalClaimHelper.STATUS)

        // Visitor Details
        expect(claims[0].DateOfBirth).to.deep.equal(internalVisitorHelper.DATE_OF_BIRTH.toDate())

        // Prisoner Details
        expect(claims[0].FirstName).to.equal(internalPrisonerHelper.FIRST_NAME)
        expect(claims[0].LastName).to.equal(internalPrisonerHelper.LAST_NAME)
        expect(claims[0].NameOfPrison).to.equal(internalPrisonerHelper.NAME_OF_PRISON)
        expect(claims[0].PrisonNumber).to.equal(internalPrisonerHelper.PRISON_NUMBER)
      },
    )
  })
})
