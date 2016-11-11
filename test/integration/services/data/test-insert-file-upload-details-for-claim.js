const expect = require('chai').expect
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const claimHelper = require('../../../helpers/data/claim-helper')
const claimDocumentHelper = require('../../../helpers/data/claim-document-helper')
const insertClaimDocument = require('../../../../app/services/data/insert-file-upload-details-for-claim')

describe('services/data/insert-file-upload-details-for-claim', function () {
  var REFERENCE = 'V123456'
  var claimId

  before(function () {
    return eligiblityHelper.insertEligibilityVisitorAndPrisoner(REFERENCE)
      .then(function () {
        return claimHelper.insert(REFERENCE)
          .then(function (newClaimId) {
            claimId = newClaimId
          })
      })
  })

  it('should insert a new claim document', function () {
    return insertClaimDocument(claimDocumentHelper.build(claimId))
      .then(function () {
        return claimDocumentHelper.get(claimId)
      })
      .then(function (claimDocument) {
        expect(claimDocument.ClaimId).to.equal(claimId)
        expect(claimDocument.DocumentStatus).to.equal(claimDocumentHelper.DOCUMENT_STATUS)
        expect(claimDocument.DocumentType).to.equal(claimDocumentHelper.DOCUMENT_TYPE)
        expect(claimDocument.Filepath).to.equal(claimDocumentHelper.PATH)
      })
  })

  it('should throw an error if passed a non file upload object.', function () {
    return expect(function () {
      insertClaimDocument({})
    }).to.throw(Error)
  })

  after(function () {
    return claimDocumentHelper.delete(claimId)
      .then(function () {
        return claimHelper.delete(claimId)
      })
      .then(function () {
        return eligiblityHelper.deleteEligibilityVisitorAndPrisoner(REFERENCE)
      })
  })
})
