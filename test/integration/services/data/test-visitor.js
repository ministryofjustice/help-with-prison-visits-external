var expect = require('chai').expect
var config = require('../../../../knexfile').migrations
var knex = require('knex')(config)
var moment = require('moment')

var visitor = require('../../../../app/services/data/visitor')
var reference = 'V123456'

describe('services/data/visitor', function () {
  describe('insert', function (done) {
    before(function (done) {
      knex('ExtSchema.Eligibility').insert({
        Reference: reference,
        DateCreated: moment().toDate(),
        Status: 'TEST'
      }).then(function () {
        done()
      })
    })

    it('should insert a new Visitor for a reference', function (done) {
      var visitorData = {
        Title: 'Mr',
        FirstName: 'John  ',
        LastName: '  Smith',
        NationalInsuranceNumber: 'QQ 12 34 56 c',
        HouseNumberAndStreet: '1 Test Road',
        Town: '1 Test Road',
        County: 'Durham',
        PostCode: 'bT11 1BT',
        Country: 'England',
        EmailAddress: 'test@test.com',
        PhoneNumber: '07911111111',
        DateOfBirth: '1980-02-01',
        Relationship: 'partner',
        JourneyAssistance: 'no',
        RequireBenefitUpload: 'n'
      }

      visitor.insert(reference, visitorData)
        .then(function () {
          knex.select().from('ExtSchema.Visitor').where('Reference', reference).then(function (results) {
            expect(results.length).to.equal(1)
            expect(results[0].Reference).to.equal(reference)
            expect(results[0].FirstName).to.equal('John')
            expect(results[0].LastName).to.equal('Smith')
            expect(results[0].NationalInsuranceNumber).to.equal('QQ123456C')
            expect(results[0].DateOfBirth.toDateString()).to.equal('Fri Feb 01 1980')
            expect(results[0].PostCode).to.equal('BT111BT')
            done()
          })
        })
        .catch(function (error) {
          throw error
        })
    })

    after(function (done) {
      // Clean up
      knex('ExtSchema.Visitor').where('Reference', reference).del().then(function () {
        knex('ExtSchema.Eligibility').where('Reference', reference).del().then(function () {
          done()
        })
      })
    })
  })
})
