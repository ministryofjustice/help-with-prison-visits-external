const expect = require('chai').expect
const insertFirstTimeClaim = require('../../../../app/services/data/insert-first-time-claim')
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const claimHelper = require('../../../helpers/data/claim-helper')

describe('services/data/insert-first-time-claim', function () {
  const REFERENCE = 'APVS137'
  var eligiblityId
  var claimId

  before(function () {
    return eligiblityHelper.insert(REFERENCE)
      .then(function (newEligiblityId) {
        eligiblityId = newEligiblityId
      })
  })

  it('should insert a new Claim record', function () {
    return insertFirstTimeClaim(REFERENCE, eligiblityId, claimHelper.build(REFERENCE))
      .then(function (newClaimId) {
        claimId = newClaimId
        return claimHelper.get(claimId)
      })
      .then(function (claim) {
        expect(claim.EligibilityId).to.be.equal(eligiblityId)
        expect(claim.Reference).to.be.equal(REFERENCE)
        expect(claim.DateOfJourney).to.be.within(
          claimHelper.DATE_OF_JOURNEY.subtract(1, 'seconds').toDate(),
          claimHelper.DATE_OF_JOURNEY.add(1, 'seconds').toDate()
        )
        expect(claim.DateSubmitted).to.be.equal(null)
        expect(claim.Status).to.equal(claimHelper.STATUS)
      })
  })

  it('should throw an error if passed a non-expense object.', function () {
    return expect(function () {
      insertFirstTimeClaim({})
    }).to.throw(Error)
  })

  after(function () {
    return eligiblityHelper.deleteAll(REFERENCE)
  })
})
