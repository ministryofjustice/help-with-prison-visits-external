const expect = require('chai').expect
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const claimHelper = require('../../../helpers/data/claim-helper')
const claimChildHelper = require('../../../helpers/data/claim-child-helper')
const expenseHelper = require('../../../helpers/data/expense-helper')
const claimDocumentHelper = require('../../../helpers/data/claim-document-helper')

const getClaimDocumentFilePath = require('../../../../app/services/data/get-claim-document-file-path')

var REFERENCE = 'V123456'
var eligibilityId
var claimId
var claimDocumentId

claimDocumentHelper.PATH = '/files/test-file.jpg'
var filePath = claimDocumentHelper.PATH

describe('services/data/get-claim-document-file-path', function () {
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
            return claimDocumentHelper.insert(REFERENCE, eligibilityId, claimId)
          })
          .then(function (newClaimDocumentId) {
            claimDocumentId = newClaimDocumentId
          })
      })
  })

  it('should return a ClaimDocument file path', function () {
    return getClaimDocumentFilePath(claimDocumentId)
      .then(function (result) {
        expect(result.Filepath).to.equal(filePath)
      })
  })

  after(function () {
    return eligiblityHelper.deleteAll(REFERENCE)
  })
})
