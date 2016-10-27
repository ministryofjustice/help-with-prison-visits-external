const expect = require('chai').expect
const config = require('../../../../knexfile').migrations
const knex = require('knex')(config)
const moment = require('moment')

const submitFirstTimeClaim = require('../../../../app/services/data/submit-first-time-claim')

const reference = 'S123456'
var claimId

describe('services/data/submit-first-time-claim', function () {
  before(function (done) {
    knex('ExtSchema.Eligibility').insert({
      Reference: reference,
      DateCreated: moment().toDate(),
      Status: 'TEST'
    })
    .then(function () {
      return knex('ExtSchema.Claim').insert({
        Reference: reference,
        DateOfJourney: moment().toDate(),
        DateCreated: moment().toDate(),
        Status: 'TEST'
      })
      .returning('ClaimId')
      .then(function (result) {
        claimId = result[0]
        done()
      })
    })
  })

  it('should update Eligibility and Claim status to SUBMITTED and DateSubmitted', function (done) {
    var currentDate = new Date()

    submitFirstTimeClaim(reference, claimId)
      .then(function () {
        knex.first().from('ExtSchema.Eligibility').where('Reference', reference)
          .then(function (result) {
            expect(result.Status).to.equal('SUBMITTED')
            expect(result.DateSubmitted).to.be.within(currentDate.setMinutes(currentDate.getMinutes() - 2), currentDate.setMinutes(currentDate.getMinutes() + 2))

            return knex.first().from('ExtSchema.Claim').where('Reference', reference)
              .then(function (result) {
                expect(result.Status).to.equal('SUBMITTED')
                expect(result.DateSubmitted).to.be.within(currentDate.setMinutes(currentDate.getMinutes() - 2), currentDate.setMinutes(currentDate.getMinutes() + 2))

                done()
              })
          })
      })
      .catch(function (error) {
        throw error
      })
  })

  after(function (done) {
    // TODO REMOVE TEMPORARY TRANSPORT AND EXPENSE CLEAN UP
    knex('ExtSchema.ClaimTransport').where('ClaimId', claimId).del().then(function () {
      return knex('ExtSchema.ClaimExpense').where('ClaimId', claimId).del().then(function () {
        // Clean up
        return knex('ExtSchema.Claim').where('ClaimId', claimId).del().then(function () {
          return knex('ExtSchema.Eligibility').where('Reference', reference).del()
        })
      })
    })
    .then(function () {
      done()
    })
  })
})
