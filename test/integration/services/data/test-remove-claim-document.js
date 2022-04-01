const expect = require('chai').expect
const removeClaimDocument = require('../../../../app/services/data/remove-claim-document')
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const claimDocumentHelper = require('../../../helpers/data/claim-document-helper')

describe('services/data/remove-claim-document', function () {
  const REFERENCE = 'V123467'
  let eligibilityId
  let claimId
  let claimDocumentId

  before(function () {
    return eligiblityHelper.insertEligibilityClaim(REFERENCE)
      .then(function (ids) {
        eligibilityId = ids.eligibilityId
        claimId = ids.claimId
        return claimDocumentHelper.insert(REFERENCE, eligibilityId, claimId, claimDocumentHelper.DOCUMENT_TYPE)
          .then(function (claimDocId) {
            claimDocumentId = claimDocId[0].ClaimDocumentId
          })
      })
  })

  it('should disable a claim document', function () {
    return removeClaimDocument(claimDocumentId)
      .then(function () {
        return claimDocumentHelper.get(claimId)
      })
      .then(function (claimDocument) {
        expect(claimDocument.Reference).to.equal(REFERENCE)
        expect(claimDocument.ClaimId).to.equal(claimId)
        expect(claimDocument.DocumentType).to.equal(claimDocumentHelper.DOCUMENT_TYPE)
        expect(claimDocument.IsEnabled).to.equal(false)
      })
  })

  after(function () {
    return eligiblityHelper.deleteAll(REFERENCE)
  })
})
