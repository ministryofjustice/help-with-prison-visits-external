const expect = require('chai').expect
const config = require('../../../../knexfile').migrations
const knex = require('knex')(config)
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const claimTypeEnum = require('../../../../app/constants/claim-type-enum')
const ticketOwnerEnum = require('../../../../app/constants/ticket-owner-enum')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')

const insertNewClaimStub = sinon.stub()
const getLastClaimDetailsStub = sinon.stub()

const insertRepeatDuplicateClaim = proxyquire('../../../../app/services/data/insert-repeat-duplicate-claim', {
  './insert-new-claim': insertNewClaimStub,
  './get-last-claim-details': getLastClaimDetailsStub
})

describe('services/data/insert-repeat-duplicate-claim', function () {
  const REFERENCE = 'INSDUPC'
  const NEW_CLAIM = {}
  const CHILDREN = [
    {
      FirstName: 'Jane',
      LastName: 'Bloggs',
      DateOfBirth: new Date(),
      Relationship: 'claimants-child'
    }
  ]
  const EXPENSES = [
    {
      ExpenseType: 'bus',
      Cost: 20,
      TravelTime: null,
      From: 'London',
      To: 'Hewell',
      IsReturn: false,
      DurationOfTravel: null,
      TicketType: null,
      TicketOwner: ticketOwnerEnum.YOU.value
    }
  ]
  const LAST_CLAIM_DETAILS = { children: CHILDREN, expenses: EXPENSES }

  var eligibilityId
  var claimId

  beforeEach(function () {
    return eligiblityHelper.insertEligibilityClaim(REFERENCE)
      .then(function (ids) {
        eligibilityId = ids.eligibilityId
        claimId = ids.claimId
      })
  })

  afterEach(function () {
    return eligiblityHelper.deleteAll(REFERENCE)
  })

  it('should call to insert new Claim then copy last claim children and expenses', function () {
    insertNewClaimStub.resolves(claimId)
    getLastClaimDetailsStub.resolves(LAST_CLAIM_DETAILS)

    return insertRepeatDuplicateClaim(REFERENCE, eligibilityId, NEW_CLAIM)
      .then(function () {
        expect(insertNewClaimStub.calledWith(REFERENCE, eligibilityId, claimTypeEnum.REPEAT_DUPLICATE, NEW_CLAIM)).to.be.true
        expect(getLastClaimDetailsStub.calledWith(REFERENCE, eligibilityId)).to.be.true
      })
      .then(function () {
        return knex.select().from('ExtSchema.ClaimChild').where('ClaimId', claimId)
          .then(function (result) {
            expect(result.length).to.equal(1)
            expect(result[0].FirstName).to.equal(CHILDREN[0].FirstName)
            expect(result[0].LastName).to.equal(CHILDREN[0].LastName)
          })
      })
      .then(function () {
        return knex.select().from('ExtSchema.ClaimExpense').where('ClaimId', claimId)
          .then(function (result) {
            expect(result.length).to.equal(1)
            expect(result[0].ExpenseType).to.equal(EXPENSES[0].ExpenseType)
          })
      })
  })
})
