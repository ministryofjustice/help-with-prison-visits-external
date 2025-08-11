const { expect } = require('chai')
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const claimDocumentHelper = require('../../../helpers/data/claim-document-helper')
const disableOldClaimDocuments = require('../../../../app/services/data/disable-old-claim-documents')

describe('services/data/disable-non-ticketed-expenses-for-claim', () => {
  const REFERENCE = 'DISDOCS'
  let eligibilityId
  let claimId
  let fileUpload

  beforeEach(() => {
    return eligiblityHelper.insertEligibilityClaim(REFERENCE).then(function (ids) {
      eligibilityId = ids.eligibilityId
      claimId = ids.claimId
      fileUpload = claimDocumentHelper.build(claimId)
      fileUpload.claimExpenseId = null
      return claimDocumentHelper.insert(REFERENCE, eligibilityId, claimId, claimDocumentHelper.DOCUMENT_TYPE)
    })
  })

  it('should disable previous documents if not a multipage document', () => {
    const multipageDoc = false
    return disableOldClaimDocuments(REFERENCE, claimId, fileUpload, multipageDoc)
      .then(() => {
        return claimDocumentHelper.get(claimId)
      })
      .then(function (claimDocument) {
        expect(claimDocument.Reference).to.equal(REFERENCE)
        expect(claimDocument.ClaimId).to.equal(claimId)
        expect(claimDocument.DocumentType).to.equal(claimDocumentHelper.DOCUMENT_TYPE)
        expect(claimDocument.IsEnabled).to.equal(false)
      })
  })

  it('should not disable previous documents for multipage documents', () => {
    const multipageDoc = true
    return disableOldClaimDocuments(REFERENCE, claimId, fileUpload, multipageDoc)
      .then(() => {
        return claimDocumentHelper.get(claimId)
      })
      .then(function (claimDocument) {
        expect(claimDocument.Reference).to.equal(REFERENCE)
        expect(claimDocument.ClaimId).to.equal(claimId)
        expect(claimDocument.DocumentType).to.equal(claimDocumentHelper.DOCUMENT_TYPE)
        expect(claimDocument.IsEnabled).to.equal(true)
      })
  })

  afterEach(() => {
    return eligiblityHelper.deleteAll(REFERENCE)
  })
})
