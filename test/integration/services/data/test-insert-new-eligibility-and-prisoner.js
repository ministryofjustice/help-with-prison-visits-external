const expect = require('chai').expect
const eligibilityStatusEnum = require('../../../../app/constants/eligibility-status-enum')
const AboutThePrisoner = require('../../../../app/services/domain/about-the-prisoner')
const prisonerHelper = require('../../../helpers/data/prisoner-helper')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const config = require('../../../../knexfile').migrations
const knex = require('knex')(config)
const moment = require('moment')

const uniqueReference1 = '1234567'
const uniqueReference2 = '2345678'
const nonuniqueReference = 'AAAAAAA'

const aboutThePrisoner = new AboutThePrisoner(prisonerHelper.FIRST_NAME,
  prisonerHelper.LAST_NAME,
  '13', '01', '1980',
  prisonerHelper.PRISON_NUMBER,
  prisonerHelper.NAME_OF_PRISON)

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

    return insertNewEligibilityAndPrisoner(aboutThePrisoner)
      .then(function (result) {
        var newReference = result.reference
        var newEligibilityId = result.eligibilityId

        expect(newReference).to.equal(uniqueReference1)
        expect(newEligibilityId).to.exist

        return knex('ExtSchema.Eligibility').where('Reference', uniqueReference1).first().then(function (newEligibilityRow) {
          expect(newEligibilityRow.Status).to.equal(eligibilityStatusEnum.IN_PROGRESS)
          return knex('ExtSchema.Prisoner').where('Reference', uniqueReference1).first().then(function (newPrisonerRow) {
            expect(stubReferenceGeneratorGenerate.calledOnce).to.be.true
            expect(newPrisonerRow.FirstName).to.equal(aboutThePrisoner.firstName)
            expect(newPrisonerRow.LastName).to.equal(aboutThePrisoner.lastName)
            expect(newPrisonerRow.PrisonNumber).to.equal(aboutThePrisoner.prisonerNumber)
            expect(newPrisonerRow.NameOfPrison).to.equal(aboutThePrisoner.nameOfPrison)
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
    return insertNewEligibilityAndPrisoner(aboutThePrisoner)
      .then(function (result) {
        var usedNonuniqueReference = result.reference
        expect(usedNonuniqueReference).to.equal(nonuniqueReference)
        // Second call gets nonuniqueReference first time generate is called, uniqueReference2 after that
        return insertNewEligibilityAndPrisoner(aboutThePrisoner)
          .then(function (result) {
            var shouldHaveUsedUniqueReference2 = result.reference
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
