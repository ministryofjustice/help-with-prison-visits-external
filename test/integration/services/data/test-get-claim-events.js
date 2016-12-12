const expect = require('chai').expect
const getClaimEvents = require('../../../../app/services/data/get-claim-events')
const internalEligiblityHelper = require('../../../helpers/data/internal/internal-eligibility-helper')
const internalClaimEventHelper = require('../../../helpers/data/internal/internal-claim-event-helper')

describe('services/data/get-claim-events', function () {
  const REFERENCE = 'EVENT12'
  const INVALID_REFERENCE = 'INVALID'
  var claimId

  before(function () {
    return internalEligiblityHelper.insertEligibilityAndClaim(REFERENCE)
      .then(function (ids) {
        claimId = ids.claimId
      })
  })

  after(function () {
    return internalEligiblityHelper.deleteAll(REFERENCE)
  })

  it('should retrieve all claim events that are not internal given reference and claimId', function () {
    return getClaimEvents(REFERENCE, claimId)
      .then(function (events) {
        expect(events.length).to.be.equal(1)
        expect(events[0].Caseworker).to.be.equal('Caseworker')
        expect(events[0].Note).to.be.equal(internalClaimEventHelper.NOTE)
      })
  })

  it('should return empty for an invalid reference and claimId', function () {
    return getClaimEvents(INVALID_REFERENCE, '1234', null)
      .then(function (events) {
        expect(events.length).to.be.equal(0)
      })
  })
})
