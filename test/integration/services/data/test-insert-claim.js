var expect = require('chai').expect
var config = require('../../../../knexfile').migrations
var knex = require('knex')(config)
var moment = require('moment')
var insertClaim = require('../../../../app/services/data/insert-claim')
var Claim = require('../../../../app/services/domain/claim')

var reference = 'APVS123'
var claimId
var dateOfJourney = moment()
var dateCreated = moment()
var status = 'IN-PROGRESS'

describe('services/data/insert-claim', function () {
  before(function (done) {
    knex('ExtSchema.Eligibility').insert({
      Reference: reference,
      DateCreated: moment().toDate(),
      Status: 'TEST'
    })
    .then(function () {
      done()
    })
  })

  it('should insert a new Claim record', function (done) {
    var claim = new Claim(
      reference,
      dateOfJourney,
      dateCreated,
      null,
      status
    )

    insertClaim(claim)
      .returning('ClaimId')
      .then(function (insertClaimResult) {
        claimId = insertClaimResult[0]
        knex.select().from('ExtSchema.Claim').where('ClaimId', claimId)
          .then(function (results) {
            expect(results.length).to.equal(1)
            expect(results[0].DateOfJourney).to.be.within(
                dateOfJourney.subtract(1, 'seconds').toDate(),
                dateOfJourney.add(1, 'seconds').toDate()
            )
            expect(results[0].DateCreated).to.be.within(
                dateCreated.subtract(1, 'seconds').toDate(),
                dateCreated.add(1, 'seconds').toDate()
            )
            expect(results[0].DateSubmitted).to.equal(null)
            expect(results[0].Status).to.equal(status)
            done()
          })
      })
  })

  after(function (done) {
    // Clean up
    knex('ExtSchema.Claim').where('ClaimId', claimId).del().then(function () {
      knex('ExtSchema.Eligibility').where('Reference', reference).del().then(function () {
        done()
      })
    })
  })
})
