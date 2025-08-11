const { expect } = require('chai')
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const claimHelper = require('../../../helpers/data/claim-helper')
const claimChildHelper = require('../../../helpers/data/claim-child-helper')
const expenseHelper = require('../../../helpers/data/expense-helper')
const claimDocumentHelper = require('../../../helpers/data/claim-document-helper')

const getClaimDocumentFilePath = require('../../../../app/services/data/get-claim-document-file-path')

const REFERENCE = 'V123456'
let eligibilityId
let claimId
let claimDocumentId

describe('services/data/get-claim-document-file-path', () => {
  before(() => {
    return eligiblityHelper.insertEligibilityVisitorAndPrisoner(REFERENCE).then(newEligibilityId => {
      eligibilityId = newEligibilityId

      return claimHelper
        .insert(REFERENCE, eligibilityId)
        .then(newClaimId => {
          claimId = newClaimId
          return expenseHelper.insert(REFERENCE, eligibilityId, claimId)
        })
        .then(() => {
          return claimChildHelper.insert(REFERENCE, eligibilityId, claimId)
        })
        .then(() => {
          return claimDocumentHelper.insert(REFERENCE, eligibilityId, claimId, claimDocumentHelper.DOCUMENT_TYPE)
        })
        .then(function (newClaimDocumentId) {
          claimDocumentId = newClaimDocumentId[0].ClaimDocumentId
        })
    })
  })

  it('should return a ClaimDocument file path', () => {
    return getClaimDocumentFilePath(claimDocumentId).then(result => {
      expect(result.Filepath).to.equal(claimDocumentHelper.PATH)
    })
  })

  after(() => {
    return eligiblityHelper.deleteAll(REFERENCE)
  })
})
