const expect = require('chai').expect
const referenceGenerator = require('../../../../app/services/reference-generator')
const eligibilityStatusEnum = require('../../../../app/constants/eligibility-status-enum')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const config = require('../../../../knexfile').migrations
const knex = require('knex')(config)
const moment = require('moment')

const uniqueReference1 = '1234567'
const uniqueReference2 = '2345678'
const nonuniqueReference = 'AAAAAAA'

const prisonerData = {
  FirstName: 'John   ',
  LastName: '   Smith',
  'dob-year': '1980',
  'dob-month': '01',
  'dob-day': '13',
  PrisonerNumber: 'A3 456Tb ',
  NameOfPrison: '  Whitemoor  '
}

const firstTimeClaim = proxyquire('../../../../app/services/data/first-time-claim', {
  '../reference-generator': referenceGenerator
})

describe('services/data/firstTimeClaim', function () {
  beforeEach(function () {
    if (referenceGenerator.generate.restore) referenceGenerator.generate.restore()
  })

  describe('insertNewEligibilityAndPrisoner', function (done) {
    it('should insert a new Eligibility and Prisoner returning reference', function (done) {
      var stubReferenceGeneratorGenerate = sinon.stub(referenceGenerator, 'generate').returns(uniqueReference1)

      firstTimeClaim.insertNewEligibilityAndPrisoner(prisonerData)
        .then(function (newReference) {
          expect(newReference).to.equal(uniqueReference1)

          knex('ExtSchema.Eligibility').where('Reference', uniqueReference1).first().then(function (newEligibilityRow) {
            expect(newEligibilityRow.Status).to.equal(eligibilityStatusEnum.IN_PROGRESS)
            knex('ExtSchema.Prisoner').where('Reference', uniqueReference1).first().then(function (newPrisonerRow) {
              expect(stubReferenceGeneratorGenerate.calledOnce).to.be.true
              expect(newPrisonerRow.FirstName, 'did not trim name').to.equal('John')
              expect(newPrisonerRow.LastName, 'did not trim name').to.equal('Smith')
              expect(newPrisonerRow.PrisonNumber, 'did not replace space/uppercase prison number').to.equal('A3456TB')
              expect(newPrisonerRow.NameOfPrison, 'did not trim name of prison').to.equal('Whitemoor')
              expect(newPrisonerRow.DateOfBirth, 'did not set date correctly').to.be.within(moment('1980-01-12 11:59:59').toDate(), moment('1980-01-13 00:00:01').toDate())
              done()
            })
          })
        })
        .catch(function (error) {
          done(error)
        })
    })

    it('should call referenceGenerator again if first reference is in use to ensure unique', function (done) {
      const stubReferenceGeneratorGenerate = sinon.stub(referenceGenerator, 'generate')
      stubReferenceGeneratorGenerate.onCall(0).returns(nonuniqueReference) // Already used ref
      stubReferenceGeneratorGenerate.onCall(1).returns(nonuniqueReference) // Somehow duplicate ref generated
      stubReferenceGeneratorGenerate.onCall(2).returns(uniqueReference2)   // New unique ref generated

      // First call uses nonuniqueReference
      firstTimeClaim.insertNewEligibilityAndPrisoner(prisonerData)
        .then(function (usedNonuniqueReference) {
          expect(usedNonuniqueReference).to.equal(nonuniqueReference)
          // Second call gets nonuniqueReference first time generate is called, uniqueReference2 after that
          firstTimeClaim.insertNewEligibilityAndPrisoner(prisonerData)
            .then(function (shouldHaveUsedUniqueReference2) {
              expect(shouldHaveUsedUniqueReference2).to.equal(uniqueReference2)
              done()
            })
        })
        .catch(function (error) {
          done(error)
        })
    })

    after(function (done) {
      // Clean up
      knex('ExtSchema.Prisoner').whereIn('Reference', [uniqueReference1, uniqueReference2, nonuniqueReference]).del().then(function () {
        knex('ExtSchema.Eligibility').whereIn('Reference', [uniqueReference1, uniqueReference2, nonuniqueReference]).del().then(function () {
          done()
        })
      })
    })
  })
})
