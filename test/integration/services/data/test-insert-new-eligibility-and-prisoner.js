const expect = require('chai').expect
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

var stubReferenceGenerator = sinon.stub()

const insertNewEligibilityAndPrisoner = proxyquire('../../../../app/services/data/insert-new-eligibility-and-prisoner', {
  '../reference-generator': stubReferenceGenerator
})

describe('services/data/insert-new-eligibility-and-prisoner', function () {
  beforeEach(function () {
    if (stubReferenceGenerator.generate.restore) stubReferenceGenerator.generate.restore()
  })

  it('should insert a new Eligibility and Prisoner returning reference', function () {
    const stubReferenceGeneratorGenerate = sinon.stub(stubReferenceGenerator, 'generate').returns(uniqueReference1)

    return insertNewEligibilityAndPrisoner(prisonerData)
      .then(function (newReference) {
        expect(newReference).to.equal(uniqueReference1)

        return knex('ExtSchema.Eligibility').where('Reference', uniqueReference1).first().then(function (newEligibilityRow) {
          expect(newEligibilityRow.Status).to.equal(eligibilityStatusEnum.IN_PROGRESS)
          return knex('ExtSchema.Prisoner').where('Reference', uniqueReference1).first().then(function (newPrisonerRow) {
            expect(stubReferenceGeneratorGenerate.calledOnce).to.be.true
            expect(newPrisonerRow.FirstName, 'did not trim name').to.equal('John')
            expect(newPrisonerRow.LastName, 'did not trim name').to.equal('Smith')
            expect(newPrisonerRow.PrisonNumber, 'did not replace space/uppercase prison number').to.equal('A3456TB')
            expect(newPrisonerRow.NameOfPrison, 'did not trim name of prison').to.equal('Whitemoor')
            expect(newPrisonerRow.DateOfBirth, 'did not set date correctly').to.be.within(moment('1980-01-12 11:59:59').toDate(), moment('1980-01-13 00:00:01').toDate())
          })
        })
      })
  })

  it('should call referenceGenerator again if first reference is in use to ensure unique', function () {
    const stubReferenceGeneratorGenerate = sinon.stub(stubReferenceGenerator, 'generate')
    stubReferenceGeneratorGenerate.onCall(0).returns(nonuniqueReference) // Already used ref
    stubReferenceGeneratorGenerate.onCall(1).returns(nonuniqueReference) // Somehow duplicate ref generated
    stubReferenceGeneratorGenerate.onCall(2).returns(uniqueReference2)   // New unique ref generated

    // First call uses nonuniqueReference
    return insertNewEligibilityAndPrisoner(prisonerData)
      .then(function (usedNonuniqueReference) {
        expect(usedNonuniqueReference).to.equal(nonuniqueReference)
        // Second call gets nonuniqueReference first time generate is called, uniqueReference2 after that
        return insertNewEligibilityAndPrisoner(prisonerData)
          .then(function (shouldHaveUsedUniqueReference2) {
            expect(shouldHaveUsedUniqueReference2).to.equal(uniqueReference2)
          })
      })
  })

  after(function () {
    // Clean up
    return knex('ExtSchema.Prisoner').whereIn('Reference', [uniqueReference1, uniqueReference2, nonuniqueReference]).del().then(function () {
      return knex('ExtSchema.Eligibility').whereIn('Reference', [uniqueReference1, uniqueReference2, nonuniqueReference]).del()
    })
  })
})
