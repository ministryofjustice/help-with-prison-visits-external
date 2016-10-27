const expect = require('chai').expect
const config = require('../../../../knexfile').migrations
const knex = require('knex')(config)
const moment = require('moment')
const claimStatusEnum = require('../../../../app/constants/claim-status-enum')
const insertFirstTimeClaim = require('../../../../app/services/data/insert-first-time-claim')
const FirstTimeClaim = require('../../../../app/services/domain/first-time-claim')

var reference = 'APVS123'
var claimId
var dateOfJourney = moment(['2016', '10', '26'])

describe('services/data/insert-first-time-claim', function () {
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
    var firstTimeClaim = new FirstTimeClaim(
      reference,
      '26',
      '10',
      '2016'
    )

    insertFirstTimeClaim(firstTimeClaim)
      .returning('ClaimId')
      .then(function (insertResult) {
        claimId = insertResult[0]
        knex.select().from('ExtSchema.Claim').where('ClaimId', claimId)
          .then(function (results) {
            expect(results.length).to.equal(1)
            expect(results[0].DateOfJourney).to.be.within(
                dateOfJourney.subtract(1, 'seconds').toDate(),
                dateOfJourney.add(1, 'seconds').toDate()
            )
            expect(results[0].DateSubmitted).to.equal(null)
            expect(results[0].Status).to.equal(claimStatusEnum.IN_PROGRESS)
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
