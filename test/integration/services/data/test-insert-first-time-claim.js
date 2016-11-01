const expect = require('chai').expect
const config = require('../../../../knexfile').migrations
const knex = require('knex')(config)
const moment = require('moment')
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const claimHelper = require('../../../helpers/data/claim-helper')

describe('services/data/insert-first-time-claim', function () {
  const REFERENCE = 'APVS123'

  before(function () {
    return eligiblityHelper.insert(REFERENCE)
  })

  it('should insert a new Claim record', function () {
    return claimHelper.insert(REFERENCE)
      .then(function() {
        return claimHelper.get(claimHelper.CLAIM_ID)
      })
      .then(function (claim) {
        expect(claim.length).to.equal(1)
        expect(claim[0].DateOfJourney).to.be.within(
          moment(claimHelper.DATE_OF_JOURNEY).subtract(1, 'seconds').toDate(),
          moment(claimHelper.DATE_OF_JOURNEY).add(1, 'seconds').toDate()
        )
        expect(claim[0].DateSubmitted).to.be.within(
          moment(claimHelper.DATE_SUBMITTED).subtract(1, 'seconds').toDate(),
          moment(claimHelper.DATE_SUBMITTED).add(1, 'seconds').toDate()
        )
        expect(claim[0].Status).to.equal(claimHelper.STATUS)
      })
  })

  after(function () {
    return claimHelper.delete(claimHelper.CLAIM_ID)
      .then(function() {
        return eligiblityHelper.delete(REFERENCE)
      })
  })
})
