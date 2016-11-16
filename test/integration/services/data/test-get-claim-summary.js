const expect = require('chai').expect
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const claimHelper = require('../../../helpers/data/claim-helper')
const claimChildHelper = require('../../../helpers/data/claim-child-helper')
const expenseHelper = require('../../../helpers/data/expense-helper')
const claimDocumentHelper = require('../../../helpers/data/claim-document-helper')

const getClaimSummary = require('../../../../app/services/data/get-claim-summary')

var REFERENCE = 'V123456'
var eligibilityId
var claimId

describe('services/data/get-claim-summary', function () {
  before(function () {
    return eligiblityHelper.insertEligibilityVisitorAndPrisoner(REFERENCE)
      .then(function (newEligibilityId) {
        eligibilityId = newEligibilityId

        return claimHelper.insert(REFERENCE, eligibilityId)
          .then(function (newClaimId) {
            claimId = newClaimId
            return expenseHelper.insert(REFERENCE, eligibilityId, claimId)
          })
          .then(function () {
            return claimChildHelper.insert(REFERENCE, eligibilityId, claimId)
          })
          .then(function () {
            return claimDocumentHelper.insert(REFERENCE, eligibilityId, claimId, claimDocumentHelper.DOCUMENT_TYPE)
              .then(function () {
                return claimDocumentHelper.insert(REFERENCE, eligibilityId, claimId, 'BENEFIT')
              })
          })
      })
  })

  it('should return summary of claim details', function () {
    return getClaimSummary(claimId)
      .then(function (result) {
        expect(result.claim.Reference).to.equal(REFERENCE)
        expect(result.claim.DateOfJourney).to.be.within(
          claimHelper.DATE_OF_JOURNEY.subtract(1, 'seconds').toDate(),
          claimHelper.DATE_OF_JOURNEY.add(1, 'seconds').toDate()
        )
        expect(result.claim.visitConfirmation.DocumentStatus).to.equal(claimDocumentHelper.DOCUMENT_STATUS)
        expect(result.claim.benefitDocument[0].DocumentStatus).to.equal(claimDocumentHelper.DOCUMENT_STATUS)
        expect(result.claimExpenses[0].ExpenseType).to.equal(expenseHelper.EXPENSE_TYPE)
        expect(result.claimExpenses[0].Cost).to.equal(Number(expenseHelper.COST).toFixed(2))
        expect(result.claimExpenses[0].DocumentStatus).to.equal(null)
        expect(result.claimChild[0].Name).to.equal(claimChildHelper.CHILD_NAME)
      })
  })

  after(function () {
    return eligiblityHelper.deleteAll(REFERENCE)
  })
})
