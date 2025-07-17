const { expect } = require('chai')
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const claimHelper = require('../../../helpers/data/claim-helper')
const claimChildHelper = require('../../../helpers/data/claim-child-helper')
const expenseHelper = require('../../../helpers/data/expense-helper')
const claimDocumentHelper = require('../../../helpers/data/claim-document-helper')

const getAllClaimDocumentsByClaimId = require('../../../../app/services/data/get-all-claim-documents-by-claim-id')

const REFERENCE = 'V123456'
let eligibilityId
let claimId

describe('services/data/get-all-claim-documents-by-claim-id', () => {
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
    })
  })

  it('should return a ClaimDocument', () => {
    return getAllClaimDocumentsByClaimId(claimId, REFERENCE, eligibilityId).then(result => {
      expect(result.length).to.equal(1)
      expect(result[0].DocumentType).to.equal(claimDocumentHelper.DOCUMENT_TYPE)
      expect(result[0].DocumentStatus).to.equal(claimDocumentHelper.DOCUMENT_STATUS)
    })
  })

  after(() => {
    return eligiblityHelper.deleteAll(REFERENCE)
  })
})
