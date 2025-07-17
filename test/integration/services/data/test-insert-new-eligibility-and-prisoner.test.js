const { expect } = require('chai')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const moment = require('moment')
const claimTypeEnum = require('../../../../app/constants/claim-type-enum')
const eligibilityStatusEnum = require('../../../../app/constants/eligibility-status-enum')
const AboutThePrisoner = require('../../../../app/services/domain/about-the-prisoner')
const prisonerHelper = require('../../../helpers/data/prisoner-helper')
const { getDatabaseConnector } = require('../../../../app/databaseConnector')

const UNIQUE_REFERENCE1 = '1234567'
const UNIQUE_REFERENCE2 = '2345678'
const NON_UNIQUE_REFERENCE = 'AAAAAAA'
const EXISTING_REFERENCE = 'EXREF01'

const aboutThePrisoner = new AboutThePrisoner(
  prisonerHelper.FIRST_NAME,
  prisonerHelper.LAST_NAME,
  '13',
  '01',
  '1980',
  prisonerHelper.PRISON_NUMBER,
  prisonerHelper.NAME_OF_PRISON,
)

const stubReferenceGenerator = sinon.stub()

const insertNewEligibilityAndPrisoner = proxyquire(
  '../../../../app/services/data/insert-new-eligibility-and-prisoner',
  {
    '../reference-generator': stubReferenceGenerator,
  },
)

describe('services/data/insert-new-eligibility-and-prisoner', () => {
  beforeEach(() => {
    if (stubReferenceGenerator.generate.restore) stubReferenceGenerator.generate.restore()
  })

  it('should insert a new Eligibility and Prisoner returning reference', () => {
    const stubReferenceGeneratorGenerate = sinon.stub(stubReferenceGenerator, 'generate').returns(UNIQUE_REFERENCE1)

    return insertNewEligibilityAndPrisoner(aboutThePrisoner, claimTypeEnum.FIRST_TIME, undefined).then(
      result => {
        const newReference = result.reference
        const newEligibilityId = result.eligibilityId
        const db = getDatabaseConnector()

        expect(newReference).to.equal(UNIQUE_REFERENCE1)
        expect(newEligibilityId).to.exist //eslint-disable-line

        return db('ExtSchema.Eligibility')
          .where('Reference', UNIQUE_REFERENCE1)
          .first()
          .then(function (newEligibilityRow) {
            expect(newEligibilityRow.Status).to.equal(eligibilityStatusEnum.IN_PROGRESS)
            return db('ExtSchema.Prisoner')
              .where('Reference', UNIQUE_REFERENCE1)
              .first()
              .then(function (newPrisonerRow) {
            expect(stubReferenceGeneratorGenerate.calledOnce).to.be.true  //eslint-disable-line
                expect(newPrisonerRow.FirstName).to.equal(aboutThePrisoner.firstName)
                expect(newPrisonerRow.LastName).to.equal(aboutThePrisoner.lastName)
                expect(newPrisonerRow.PrisonNumber).to.equal(aboutThePrisoner.prisonerNumber)
                expect(newPrisonerRow.NameOfPrison).to.equal(aboutThePrisoner.nameOfPrison)
                expect(newPrisonerRow.DateOfBirth, 'did not set date correctly').to.be.within(
                  moment('1980-01-12 11:59:59').toDate(),
                  moment('1980-01-13 00:00:01').toDate(),
                )
              })
          })
      },
    )
  })

  it('should call referenceGenerator again if first reference is in use to ensure unique', () => {
    const stubReferenceGeneratorGenerate = sinon.stub(stubReferenceGenerator, 'generate')
    stubReferenceGeneratorGenerate.onCall(0).returns(NON_UNIQUE_REFERENCE) // Already used ref
    stubReferenceGeneratorGenerate.onCall(1).returns(NON_UNIQUE_REFERENCE) // Somehow duplicate ref generated
    stubReferenceGeneratorGenerate.onCall(2).returns(UNIQUE_REFERENCE2) // New unique ref generated

    // First call uses NON_UNIQUE_REFERENCE
    return insertNewEligibilityAndPrisoner(aboutThePrisoner, claimTypeEnum.FIRST_TIME, undefined).then(
      result => {
        expect(result.reference).to.equal(NON_UNIQUE_REFERENCE)
        // Second call gets NON_UNIQUE_REFERENCE first time generate is called, UNIQUE_REFERENCE2 after that
        return insertNewEligibilityAndPrisoner(aboutThePrisoner).then(result => {
          expect(result.reference).to.equal(UNIQUE_REFERENCE2)
        })
      },
    )
  })

  it('should use existingReference if claimType is repeat-new-eligibility', () => {
    return insertNewEligibilityAndPrisoner(
      aboutThePrisoner,
      claimTypeEnum.REPEAT_NEW_ELIGIBILITY,
      EXISTING_REFERENCE,
    ).then(result => {
      expect(result.reference).to.equal(EXISTING_REFERENCE)
    })
  })

  after(() => {
    // Clean up
    const db = getDatabaseConnector()

    return db('ExtSchema.Prisoner')
      .whereIn('Reference', [UNIQUE_REFERENCE1, UNIQUE_REFERENCE2, NON_UNIQUE_REFERENCE, EXISTING_REFERENCE])
      .del()
      .then(() => {
        return db('ExtSchema.Eligibility')
          .whereIn('Reference', [UNIQUE_REFERENCE1, UNIQUE_REFERENCE2, NON_UNIQUE_REFERENCE, EXISTING_REFERENCE])
          .del()
      })
  })
})
