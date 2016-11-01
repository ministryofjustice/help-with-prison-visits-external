var expect = require('chai').expect
var config = require('../../../../knexfile').migrations
var knex = require('knex')(config)
var moment = require('moment')
var claimStatusEnum = require('../../../../app/constants/claim-status-enum')
var insertFirstTimeClaim = require('../../../../app/services/data/insert-first-time-claim')
var FirstTimeClaim = require('../../../../app/services/domain/first-time-claim')
var dateFormatter = require('../../../../app/services/date-formatter')

var reference = 'APVS123'
var claimId
var dateOfJourney = dateFormatter.build('26', '10', '2016')

describe('services/data/insert-first-time-claim', function () {
  before(function () {
    return knex('ExtSchema.Eligibility').insert({
      Reference: reference,
      DateCreated: moment().toDate(),
      Status: 'TEST'
    })
  })

  it('should insert a new Claim record', function () {
    var firstTimeClaim = new FirstTimeClaim(
      reference,
      '26',
      '10',
      '2016'
    )

    return insertFirstTimeClaim(firstTimeClaim)
      .returning('ClaimId')
      .then(function (insertResult) {
        claimId = insertResult[0]
        knex.select().from('ExtSchema.Claim').where('ClaimId', claimId)
          .then(function (results) {
            expect(results.length).to.equal(1)
            expect(results[0].DateOfJourney).to.be.within(
                moment(dateOfJourney).subtract(1, 'seconds').toDate(),
                moment(dateOfJourney).add(1, 'seconds').toDate()
            )
            expect(results[0].DateSubmitted).to.equal(null)
            expect(results[0].Status).to.equal(claimStatusEnum.IN_PROGRESS)
          })
      })
  })

  after(function () {
    return knex('ExtSchema.Claim').where('ClaimId', claimId).del().then(function () {
      return knex('ExtSchema.Eligibility').where('Reference', reference).del().then(function () {
      })
    })
  })
})
