var expect = require('chai').expect
var config = require('../../../../knexfile').migrations
var knex = require('knex')(config)
var moment = require('moment')

var insertVisitor = require('../../../../app/services/data/insert-visitor')
var reference = 'V123456'

describe('services/data/insert-visitor', function () {
  describe('insert', function (done) {
    before(function () {
      return knex('ExtSchema.Eligibility').insert({
        Reference: reference,
        DateCreated: moment().toDate(),
        Status: 'TEST'
      })
    })

    it('should insert a new Visitor for a reference', function () {
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
        Benefit: 'income-support'
      }

      return insertVisitor(reference, visitorData)
        .then(function () {
          knex.select().from('ExtSchema.Visitor').where('Reference', reference).then(function (results) {
            expect(results.length).to.equal(1)
            expect(results[0].Reference).to.equal(reference)
            expect(results[0].FirstName).to.equal('John')
            expect(results[0].LastName).to.equal('Smith')
            expect(results[0].NationalInsuranceNumber).to.equal('QQ123456C')
            expect(results[0].DateOfBirth.toDateString()).to.equal('Fri Feb 01 1980')
            expect(results[0].PostCode).to.equal('BT111BT')
            expect(results[0].Benefit).to.equal('income-support')
            expect(results[0].RequireBenefitUpload, 'should set RequireBenefitUpload based on benefit').to.be.false
          })
        })
    })

    after(function () {
      // Clean up
      return knex('ExtSchema.Visitor').where('Reference', reference).del().then(function () {
        return knex('ExtSchema.Eligibility').where('Reference', reference).del()
      })
    })
  })
})
