const expect = require('chai').expect
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const claimHelper = require('../../../helpers/data/claim-helper')
const claimChildHelper = require('../../../helpers/data/claim-child-helper')
const expenseHelper = require('../../../helpers/data/expense-helper')
const claimDocumentHelper = require('../../../helpers/data/claim-document-helper')

const getAllClaimDocumentsByClaimId = require('../../../../app/services/data/get-all-claim-documents-by-claim-id')

var REFERENCE = 'V123456'
var eligibilityId
var claimId

describe('services/data/get-all-claim-documents-by-claim-id', function () {
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
          })
      })
  })

  it('should return a ClaimDocument file path', function () {
    return getAllClaimDocumentsByClaimId(claimId)
      .then(function (result) {
        expect(result.length).to.equal(1)
        expect(result[0].DocumentType).to.equal(claimDocumentHelper.DOCUMENT_TYPE)
        expect(result[0].DocumentStatus).to.equal(claimDocumentHelper.DOCUMENT_STATUS)
      })
  })

  after(function () {
    return eligiblityHelper.deleteAll(REFERENCE)
  })
})
