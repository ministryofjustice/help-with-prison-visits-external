const { expect } = require('chai')
const moment = require('moment')
const insertNewClaim = require('../../../../app/services/data/insert-new-claim')
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const claimHelper = require('../../../helpers/data/claim-helper')

describe('services/data/insert-new-claim', () => {
  const REFERENCE = 'APVS137'
  const CLAIM_TYPE = 'repeat'
  let eligibilityId
  let claimId

  before(() => {
    return eligiblityHelper.insert(REFERENCE).then(newEligibilityId => {
      eligibilityId = newEligibilityId
    })
  })

  it('should insert a new Claim record', () => {
    return insertNewClaim(REFERENCE, eligibilityId, CLAIM_TYPE, claimHelper.build(REFERENCE))
      .then(newClaimId => {
        claimId = newClaimId
        return claimHelper.get(claimId)
      })
      .then(claim => {
        expect(claim.EligibilityId).to.be.equal(eligibilityId)
        expect(claim.Reference).to.be.equal(REFERENCE)
        expect(claim.ClaimType).to.be.equal(CLAIM_TYPE)
        expect(claim.IsAdvanceClaim).to.be.equal(claimHelper.IS_ADVANCE_CLAIM)
        expect(moment(claim.DateOfJourney).format('DD/MM/YYYY')).to.equal(
          claimHelper.DATE_OF_JOURNEY.format('DD/MM/YYYY'),
        )
        expect(claim.DateSubmitted).to.be.equal(null)
        expect(claim.Status).to.equal(claimHelper.STATUS)
      })
  })

  it('should throw an error if passed a non-expense object.', () => {
    return expect(() => {
      insertNewClaim(REFERENCE, eligibilityId, CLAIM_TYPE, {})
    }).to.throw(Error)
  })

  after(() => {
    return eligiblityHelper.deleteAll(REFERENCE)
  })
})
