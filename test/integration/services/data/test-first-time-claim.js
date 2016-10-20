var expect = require('chai').expect
var referenceGenerator = require('../../../../app/services/reference-generator')
var eligibilityStatusEnum = require('../../../../app/constants/eligibility-status-enum')
var proxyquire = require('proxyquire')
var sinon = require('sinon')
var config = require('../../../../knexfile').migrations
var knex = require('knex')(config)

var uniqueReference = '1234567'

var firstTimeClaim = proxyquire('../../../../app/services/data/first-time-claim', {
  '../reference-generator': referenceGenerator
})

describe('firstTimeClaim', function () {
  beforeEach(function () {
    if (referenceGenerator.generate.restore) referenceGenerator.generate.restore()
  })

  describe('getUniqueReference', function (done) {
    it('should call referenceGenerator', function (done) {
      var stubGenerate = sinon.stub(referenceGenerator, 'generate').returns(uniqueReference)

      var reference = firstTimeClaim.getUniqueReference()
      expect(reference).to.equal(uniqueReference)
      expect(stubGenerate.calledOnce).to.be.true
      done()
    })

    it('should check reference is not already in use', function (done) {
      // TODO
      done()
    })
  })

  describe('insertNewEligibilityAndPrisoner', function (done) {
    it('should insert a new Eligibility and Prisoner returning reference', function (done) {
      var stubReferenceGeneratorGenerate = sinon.stub(referenceGenerator, 'generate').returns(uniqueReference)
      var prisonerData = {
        FirstName: 'John   ',
        LastName: '   Smith',
        'dob-year': '1980',
        'dob-month': '01',
        'dob-day': '13',
        PrisonerNumber: 'A3 456Tb ',
        NameOfPrison: '  Whitemoor  '
      }

      firstTimeClaim.insertNewEligibilityAndPrisoner(prisonerData)
        .then(function (newReference) {
          expect(newReference).to.equal(uniqueReference)

          knex('ExtSchema.Eligibility').where('Reference', uniqueReference).first().then(function (newEligibilityRow) {
            expect(newEligibilityRow.Status).to.equal(eligibilityStatusEnum.IN_PROGRESS)
            knex('ExtSchema.Prisoner').where('Reference', uniqueReference).first().then(function (newPrisonerRow) {
              expect(stubReferenceGeneratorGenerate.calledOnce).to.be.true
              expect(newPrisonerRow.FirstName, 'did not trim name').to.equal('John')
              expect(newPrisonerRow.LastName, 'did not trim name').to.equal('Smith')
              expect(newPrisonerRow.PrisonNumber, 'did not replace space/uppercase prison number').to.equal('A3456TB')
              expect(newPrisonerRow.NameOfPrison, 'did not trim name of prison').to.equal('Whitemoor')
              expect(newPrisonerRow.DateOfBirth, 'did not set date correctly').to.be.within(new Date('1980-01-12 11:59:59'), new Date('1980-01-13 00:00:01'))
              done()
            })
          })
        })
    })

    after(function (done) {
      // Clean up
      knex('ExtSchema.Prisoner').where('Reference', uniqueReference).del().then(function () {
        knex('ExtSchema.Eligibility').where('Reference', uniqueReference).del().then(function () {
          done()
        })
      })
    })
  })
})
