const expect = require('chai').expect
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const claimDocumentHelper = require('../../../helpers/data/claim-document-helper')
const insertClaimDocument = require('../../../../app/services/data/insert-file-upload-details-for-claim')

describe('services/data/insert-file-upload-details-for-claim', function () {
  var REFERENCE = 'V123456'
  var eligibilityId
  var claimId

  before(function () {
    return eligiblityHelper.insertEligibilityClaim(REFERENCE)
      .then(function (ids) {
        eligibilityId = ids.eligibilityId
        claimId = ids.claimId
      })
  })

  it('should insert a new claim document', function () {
    return insertClaimDocument(REFERENCE, eligibilityId, claimId, claimDocumentHelper.build(claimId))
      .then(function () {
        return claimDocumentHelper.get(claimId)
      })
      .then(function (claimDocument) {
        expect(claimDocument.EligibilityId).to.equal(eligibilityId)
        expect(claimDocument.Reference).to.equal(REFERENCE)
        expect(claimDocument.ClaimId).to.equal(claimId)
        expect(claimDocument.DocumentStatus).to.equal(claimDocumentHelper.DOCUMENT_STATUS)
        expect(claimDocument.DocumentType).to.equal(claimDocumentHelper.DOCUMENT_TYPE)
        expect(claimDocument.Filepath).to.equal(claimDocumentHelper.PATH)
      })
  })

  it('should throw an error if passed a non file upload object.', function () {
    return expect(function () {
      insertClaimDocument(REFERENCE, eligibilityId, claimId, {})
    }).to.throw(Error)
  })

  after(function () {
    return eligiblityHelper.deleteAll(REFERENCE)
  })
})
