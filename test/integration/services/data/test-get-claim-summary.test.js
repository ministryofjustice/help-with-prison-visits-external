const { expect } = require('chai')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const moment = require('moment')
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const claimHelper = require('../../../helpers/data/claim-helper')
const claimChildHelper = require('../../../helpers/data/claim-child-helper')
const expenseHelper = require('../../../helpers/data/expense-helper')
const claimDocumentHelper = require('../../../helpers/data/claim-document-helper')
const claimEscortHelper = require('../../../helpers/data/claim-escort-helper')
const claimTypeEnum = require('../../../../app/constants/claim-type-enum')

const MASKED_ELIGIBILITY = { LastName: 'MASKED_LAST_NAME' }
const getRepeatEligibilityStub = sinon.stub().resolves(MASKED_ELIGIBILITY)

const getClaimSummary = proxyquire('../../../../app/services/data/get-claim-summary', {
  './get-repeat-eligibility': getRepeatEligibilityStub,
})

const REFERENCE = 'V123456'
let eligibilityId
let claimId

const REPEAT_REFERENCE = 'REPEATC'
const REPEAT_ELIGIBILITYID = '4321'
let repeatClaimId

describe('services/data/get-claim-summary', () => {
  describe('first time claim', () => {
    before(() => {
      return eligiblityHelper.insertEligibilityVisitorAndPrisoner(REFERENCE).then(newEligibilityId => {
        eligibilityId = newEligibilityId
        return claimHelper.insertWithExpenseChildDocuments(REFERENCE, eligibilityId).then(newClaimId => {
          claimId = newClaimId
        })
      })
    })

    it('should return summary of claim details', () => {
      return getClaimSummary(claimId, claimTypeEnum.FIRST_TIME).then(result => {
        expect(result.claim.Reference).to.equal(REFERENCE)
        expect(moment(result.claim.DateOfJourney).format('DD/MM/YYYY')).to.equal(
          claimHelper.DATE_OF_JOURNEY.format('DD/MM/YYYY'),
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

    after(() => {
      return eligiblityHelper.deleteAll(REFERENCE)
    })
  })

  describe('repeat claim with existing eligibility', () => {
    beforeEach(() => {
      return claimHelper
        .insertWithExpenseChildDocuments(REPEAT_REFERENCE, REPEAT_ELIGIBILITYID)
        .then(newClaimId => {
          repeatClaimId = newClaimId
        })
    })

    it('should call to get existing repeat eligibility details from Internal Schema for repeat claims', () => {
      return getClaimSummary(repeatClaimId, claimTypeEnum.REPEAT_CLAIM).then(result => {
          expect(getRepeatEligibilityStub.calledOnce).to.be.true  //eslint-disable-line
        expect(result.claim.LastName).to.equal(MASKED_ELIGIBILITY.LastName)
      })
    })

    it('should call to get existing repeat eligibility details from Internal Schema for repeat-duplicate claims', () => {
      return getClaimSummary(repeatClaimId, claimTypeEnum.REPEAT_DUPLICATE).then(result => {
          expect(getRepeatEligibilityStub.calledOnce).to.be.true  //eslint-disable-line
        expect(result.claim.LastName).to.equal(MASKED_ELIGIBILITY.LastName)
      })
    })

    afterEach(() => {
      getRepeatEligibilityStub.resetHistory()
      return eligiblityHelper.deleteAll(REPEAT_REFERENCE)
    })
  })
})
