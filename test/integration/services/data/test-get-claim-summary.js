const expect = require('chai').expect
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const claimHelper = require('../../../helpers/data/claim-helper')
const claimChildHelper = require('../../../helpers/data/claim-child-helper')
const expenseHelper = require('../../../helpers/data/expense-helper')
const claimDocumentHelper = require('../../../helpers/data/claim-document-helper')
const claimEscortHelper = require('../../../helpers/data/claim-escort-helper')
const claimTypeEnum = require('../../../../app/constants/claim-type-enum')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')

const MASKED_ELIGIBILITY = {LastName: 'MASKED_LAST_NAME'}
const getRepeatEligibilityStub = sinon.stub().resolves(MASKED_ELIGIBILITY)

const getClaimSummary = proxyquire('../../../../app/services/data/get-claim-summary', {
  './get-repeat-eligibility': getRepeatEligibilityStub
})

const REFERENCE = 'V123456'
var eligibilityId
var claimId

const REPEAT_REFERENCE = 'REPEATC'
const REPEAT_ELIGIBILITYID = '4321'
var repeatClaimId

describe('services/data/get-claim-summary', function () {
  describe('first time claim', function () {
    before(function () {
      return eligiblityHelper.insertEligibilityVisitorAndPrisoner(REFERENCE)
        .then(function (newEligibilityId) {
          eligibilityId = newEligibilityId
          return claimHelper.insertWithExpenseChildDocuments(REFERENCE, eligibilityId)
            .then(function (newClaimId) {
              claimId = newClaimId
            })
        })
    })

    it('should return summary of claim details', function () {
      return getClaimSummary(claimId, claimTypeEnum.FIRST_TIME)
        .then(function (result) {
          expect(result.claim.Reference).to.equal(REFERENCE)
          expect(result.claim.DateOfJourney).to.be.within(
            claimHelper.DATE_OF_JOURNEY.subtract(1, 'seconds').toDate(),
            claimHelper.DATE_OF_JOURNEY.add(1, 'seconds').toDate()
          )
          expect(result.claim.IsAdvanceClaim).to.equal(false)
          expect(result.claim.visitConfirmation.DocumentStatus).to.equal(claimDocumentHelper.DOCUMENT_STATUS)
          expect(result.claim.benefitDocument[0].DocumentStatus).to.equal(claimDocumentHelper.DOCUMENT_STATUS)
          expect(result.claimExpenses[0].ExpenseType).to.equal(expenseHelper.EXPENSE_TYPE)
          expect(result.claimExpenses[0].Cost).to.equal(Number(expenseHelper.COST))
          expect(result.claimExpenses[0].DocumentStatus).to.equal(null)
          expect(result.claimChild[0].Name).to.equal(claimChildHelper.CHILD_NAME)
          expect(result.claimEscort.FirstName).to.equal(claimEscortHelper.FIRST_NAME)
        })
    })

    after(function () {
      return eligiblityHelper.deleteAll(REFERENCE)
    })
  })

  describe('repeat claim with existing eligibility', function () {
    beforeEach(function () {
      return claimHelper.insertWithExpenseChildDocuments(REPEAT_REFERENCE, REPEAT_ELIGIBILITYID)
        .then(function (newClaimId) {
          repeatClaimId = newClaimId
        })
    })

    it('should call to get existing repeat eligibility details from Internal Schema for repeat claims', function () {
      return getClaimSummary(repeatClaimId, claimTypeEnum.REPEAT_CLAIM)
        .then(function (result) {
          expect(getRepeatEligibilityStub.calledOnce).to.be.true
          expect(result.claim.LastName).to.equal(MASKED_ELIGIBILITY.LastName)
        })
    })

    it('should call to get existing repeat eligibility details from Internal Schema for repeat-duplicate claims', function () {
      return getClaimSummary(repeatClaimId, claimTypeEnum.REPEAT_DUPLICATE)
        .then(function (result) {
          expect(getRepeatEligibilityStub.calledOnce).to.be.true
          expect(result.claim.LastName).to.equal(MASKED_ELIGIBILITY.LastName)
        })
    })

    afterEach(function () {
      getRepeatEligibilityStub.reset()
      return eligiblityHelper.deleteAll(REPEAT_REFERENCE)
    })
  })
})
