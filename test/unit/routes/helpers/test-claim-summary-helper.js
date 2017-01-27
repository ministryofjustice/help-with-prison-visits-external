const chaiAsPromised = require('chai-as-promised')
const chai = require('chai').use(chaiAsPromised)
const expect = chai.expect
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')

const CLAIM_TYPE = 'first-time'
const REFERENCE = '12345'
const CLAIM_ID = '39725'
const CLAIM_EXPENSE_ID = '156'
const CLAIM_DOCUMENT_ID = '98765'

const PARAMS = {
  claimType: CLAIM_TYPE,
  referenceId: REFERENCE,
  claimId: CLAIM_ID
}

const MULTIPAGE_DOCUMENT = {
  params: PARAMS,
  query: {
    multipage: true,
    document: CLAIM_DOCUMENT_ID
  }
}

const SINGLEPAGE_DOCUMENT_WITH_CLAIM_EXPENSE_ID = {
  params: PARAMS,
  query: {
    claimExpenseId: CLAIM_EXPENSE_ID,
    document: CLAIM_DOCUMENT_ID
  }
}

const SINGLEPAGE_DOCUMENT_WITHOUT_CLAIM_EXPENSE_ID = {
  params: PARAMS,
  query: {
    document: CLAIM_DOCUMENT_ID
  }
}

describe('routes/helpers/claim-summary-helper', function () {
  var claimSummaryHelper
  var removeClaimExpenseStub
  var removeClaimDocumentStub
  var getClaimDocumnetFilePathStub

  beforeEach(function () {
    removeClaimExpenseStub = sinon.stub()
    removeClaimDocumentStub = sinon.stub()
    getClaimDocumnetFilePathStub = sinon.stub()

    claimSummaryHelper = proxyquire(
      '../../../../app/routes/helpers/claim-summary-helper', {
        '../../services/data/remove-claim-expense': removeClaimExpenseStub,
        '../../services/data/remove-claim-document': removeClaimDocumentStub,
        '../../services/data/get-claim-document-file-path': getClaimDocumnetFilePathStub
      })
  })

  describe('buildClaimSummaryUrl', function () {
    it('should return claim summary URL constaining the claim type, reference, and claim id', function () {
      var result = claimSummaryHelper.buildClaimSummaryUrl(MULTIPAGE_DOCUMENT)
      expect(result).to.equal(buildSummaryUrl(CLAIM_TYPE, REFERENCE, CLAIM_ID))
    })
  })

  describe('buildRemoveDocumentUrl', function () {
    it('should return the claim summary url if the document is multipage', function () {
      var result = claimSummaryHelper.buildRemoveDocumentUrl(MULTIPAGE_DOCUMENT)
      expect(result).to.equal(
        buildSummaryUrl(CLAIM_TYPE, REFERENCE, CLAIM_ID)
      )
    })

    it('should return the file upload url if the document is single page and claim expense id is set', function () {
      var result = claimSummaryHelper.buildRemoveDocumentUrl(SINGLEPAGE_DOCUMENT_WITH_CLAIM_EXPENSE_ID)
      expect(result).to.equal(
        `${buildSummaryUrl(CLAIM_TYPE, REFERENCE, CLAIM_ID)}/file-upload?document=${CLAIM_DOCUMENT_ID}&claimExpenseId=${CLAIM_EXPENSE_ID}`
      )
    })

    it('should return the file upload url if the document is single page and the claim expense id is not set', function () {
      var result = claimSummaryHelper.buildRemoveDocumentUrl(SINGLEPAGE_DOCUMENT_WITHOUT_CLAIM_EXPENSE_ID)
      expect(result).to.equal(
        `${buildSummaryUrl(CLAIM_TYPE, REFERENCE, CLAIM_ID)}/file-upload?document=${CLAIM_DOCUMENT_ID}`
      )
    })
  })

  describe('removeExpense', function () {
    it('should call removeExpense with the given parameters', function () {
      claimSummaryHelper.removeExpense(CLAIM_ID, CLAIM_EXPENSE_ID)
      sinon.assert.calledOnce(removeClaimExpenseStub)
      sinon.assert.calledWith(removeClaimExpenseStub, CLAIM_ID, CLAIM_EXPENSE_ID)
    })
  })

  describe('removeDocument', function () {
    it('should call removeDocument with the given parameters', function () {
      claimSummaryHelper.removeDocument(CLAIM_DOCUMENT_ID)
      sinon.assert.calledOnce(removeClaimDocumentStub)
      sinon.assert.calledWith(removeClaimDocumentStub, CLAIM_DOCUMENT_ID)
    })
  })

  describe('getBenefitDocument', function () {
    const DOCUMENT_ONE = 'document one'
    const DOCUMENT_TWO = 'document two'

    it('should return the first document if the input contains mutliple document', function () {
      var result = claimSummaryHelper.getBenefitDocument([DOCUMENT_ONE, DOCUMENT_TWO])
      expect(result).to.equal(DOCUMENT_ONE)
    })

    it('should return undefined if the input array is empty', function () {
      var result = claimSummaryHelper.getBenefitDocument([])
      expect(result).to.equal(undefined)
    })

    it('should return undefined if the input is undefined', function () {
      var result = claimSummaryHelper.getBenefitDocument()
      expect(result).to.equal(undefined)
    })
  })

  describe('getDocumentFilePath', function () {
    const FILE_EXTENSION = 'txt'
    const FILE_NAME = `example.${FILE_EXTENSION}`
    const FILE_PATH = `../../examples/${FILE_NAME}`
    const EXPECTED_FILE_NAME = `APVS-Upload.${FILE_EXTENSION}`

    it('should return an object containing the file name and file path', function () {
      getClaimDocumnetFilePathStub.resolves({ Filepath: FILE_PATH })
      return claimSummaryHelper.getDocumentFilePath()
        .then(function (file) {
          expect(file.path).to.equal(FILE_PATH)
          expect(file.name).to.equal(EXPECTED_FILE_NAME)
        })
    })

    it('should reject promise if the call to getDocumentFilePath rejects', function () {
      getClaimDocumnetFilePathStub.rejects()
      return expect(claimSummaryHelper.getDocumentFilePath()).to.be.rejected
    })

    it('should reject promise if there is no filepath returned by getDocumentFilePath call', function () {
      getClaimDocumnetFilePathStub.resolves()
      return expect(claimSummaryHelper.getDocumentFilePath()).to.be.rejected
    })
  })
})

function buildSummaryUrl (claimType, reference, claimId) {
  return `/apply/${claimType}/eligibility/${reference}/claim/${claimId}/summary`
}
