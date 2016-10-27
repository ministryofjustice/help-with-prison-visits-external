var expect = require('chai').expect
var config = require('../../../../knexfile').migrations
var knex = require('knex')(config)
var moment = require('moment')
var BankAccountDetails = require('../../../../app/services/domain/bank-account-details')

var insertBankAccountDetailsForClaim = require('../../../../app/services/data/insert-bank-account-details-for-claim')
var reference = 'V123456'
var claimId

var AccountNumber = ' 00 12 34 56 '
var SortCode = ' 11 22 3 3 '

describe('services/data/insert-bank-account-details-for-claim', function () {
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
        DateSubmitted: moment().toDate(),
        Status: 'TEST'
      })
      .returning('ClaimId')
      .then(function (result) {
        claimId = result[0]
        done()
      })
    })
  })

  it('should insert a new Bank Details record for a claim', function (done) {
    var bankDetailsData = new BankAccountDetails(AccountNumber, SortCode)

    insertBankAccountDetailsForClaim(claimId, bankDetailsData)
      .returning('ClaimBankDetailId')
      .then(function (insertClaimBankDetailResult) {
        var claimBankDetailId = insertClaimBankDetailResult[0]
        knex.select().from('ExtSchema.ClaimBankDetail').where('ClaimBankDetailId', claimBankDetailId)
          .then(function (results) {
            expect(results.length).to.equal(1)
            expect(results[0].ClaimBankDetailId).to.equal(claimBankDetailId)
            expect(results[0].ClaimId).to.equal(claimId)
            expect(results[0].AccountNumber).to.equal('00123456')
            expect(results[0].SortCode).to.equal('112233')
            done()
          })
      })
      .catch(function (error) {
        throw error
      })
  })

  it('should throw error if called with incorrect domain object type', function (done) {
    var bankDetailsData = {
      AccountNumber: AccountNumber,
      SortCode: SortCode
    }
    try {
      insertBankAccountDetailsForClaim(claimId, bankDetailsData)
    } catch (error) {
      expect(error.message).to.equal('Provided bankAccountDetails object is not an instance of the expected class')
      done()
    }
  })

  after(function (done) {
    // Clean up
    knex('ExtSchema.ClaimBankDetail').where('ClaimId', claimId).del().then(function () {
      knex('ExtSchema.Claim').where('Reference', reference).del().then(function () {
        knex('ExtSchema.Eligibility').where('Reference', reference).del().then(function () {
          done()
        })
      })
    })
  })
})
