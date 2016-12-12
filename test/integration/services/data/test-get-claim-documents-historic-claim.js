const expect = require('chai').expect
const getClaimDocumentsHistoricClaim = require('../../../../app/services/data/get-claim-documents-historic-claim')
const internalEligiblityHelper = require('../../../helpers/data/internal/internal-eligibility-helper')
const internalClaimDocumentHelper = require('../../../helpers/data/internal/internal-claim-document-helper')

describe('services/data/get-claim-documents-historic-claim', function () {
  const REFERENCE = 'HISTDOC'
  const INVALID_REFERENCE = 'INVALID'
  var claimId

  before(function () {
    return internalEligiblityHelper.insertEligibilityAndClaim(REFERENCE)
      .then(function (ids) {
        claimId = ids.claimId
      })
  })

  after(function () {
    return internalEligiblityHelper.deleteAll(REFERENCE)
  })

  it('should retrieve all claim documents given reference and claimId', function () {
    return getClaimDocumentsHistoricClaim(REFERENCE, claimId)
      .then(function (documents) {
        expect(documents.length).to.be.equal(2)
        expect(documents[0].DocumentType).to.be.equal(internalClaimDocumentHelper.DOCUMENT_TYPE)
        expect(documents[0].DocumentStatus).to.be.equal(internalClaimDocumentHelper.DOCUMENT_STATUS)
        expect(documents[1].DocumentType).to.be.equal(internalClaimDocumentHelper.DOCUMENT_TYPE2)
        expect(documents[1].DocumentStatus).to.be.equal(internalClaimDocumentHelper.DOCUMENT_STATUS2)
      })
  })

  it('should return empty for an invalid reference and claimId', function () {
    return getClaimDocumentsHistoricClaim(INVALID_REFERENCE, '1234', null)
      .then(function (documents) {
        expect(documents.length).to.be.equal(0)
      })
  })
})
