const chaiAsPromised = require('chai-as-promised')
const sinon = require('sinon')

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

jest.mock('../../services/data/remove-claim-expense', () => removeClaimExpenseStub)
jest.mock('../../services/data/remove-claim-document', () => removeClaimDocumentStub)

jest.mock(
  '../../services/data/get-claim-document-file-path',
  () => getClaimDocumentFilePathStub
)

describe('routes/helpers/claim-summary-helper', function () {
  let claimSummaryHelper
  let removeClaimExpenseStub
  let removeClaimDocumentStub
  let getClaimDocumentFilePathStub

  beforeEach(function () {
    removeClaimExpenseStub = sinon.stub()
    removeClaimDocumentStub = sinon.stub()
    getClaimDocumentFilePathStub = sinon.stub()

    claimSummaryHelper = require('../../../../app/routes/helpers/claim-summary-helper')
  })

  describe('buildClaimSummaryUrl', function () {
    it('should return claim summary URL constaining the claim type, reference, and claim id', function () {
      const result = claimSummaryHelper.buildClaimSummaryUrl(MULTIPAGE_DOCUMENT)
      expect(result).toBe('/apply/eligibility/claim/summary')
    })
  })

  describe('buildRemoveDocumentUrl', function () {
    it('should return the claim summary url if the document is multipage', function () {
      const result = claimSummaryHelper.buildRemoveDocumentUrl(MULTIPAGE_DOCUMENT)
      expect(result).toBe('/apply/eligibility/claim/summary')
    })

    it('should return the file upload url if the document is single page and claim expense id is set', function () {
      const result = claimSummaryHelper.buildRemoveDocumentUrl(SINGLEPAGE_DOCUMENT_WITH_CLAIM_EXPENSE_ID)
      expect(result).toBe(
        `/apply/eligibility/claim/summary/file-upload?document=${CLAIM_DOCUMENT_ID}&claimExpenseId=${CLAIM_EXPENSE_ID}`
      )
    })

    it('should return the file upload url if the document is single page and the claim expense id is not set', function () {
      const result = claimSummaryHelper.buildRemoveDocumentUrl(SINGLEPAGE_DOCUMENT_WITHOUT_CLAIM_EXPENSE_ID)
      expect(result).toBe(
        `/apply/eligibility/claim/summary/file-upload?document=${CLAIM_DOCUMENT_ID}`
      )
    })
  })

  describe('removeExpense', function () {
    it('should call removeExpense with the given parameters', function () {
      claimSummaryHelper.removeExpense(CLAIM_ID, CLAIM_EXPENSE_ID)
      sinon.toHaveBeenCalledTimes(1)
      sinon.assert.calledWith(removeClaimExpenseStub, CLAIM_ID, CLAIM_EXPENSE_ID)
    })
  })

  describe('removeDocument', function () {
    it('should call removeDocument with the given parameters', function () {
      claimSummaryHelper.removeDocument(CLAIM_DOCUMENT_ID)
      sinon.toHaveBeenCalledTimes(1)
      sinon.assert.calledWith(removeClaimDocumentStub, CLAIM_DOCUMENT_ID)
    })
  })

  describe('getBenefitDocument', function () {
    const DOCUMENT_ONE = 'document one'
    const DOCUMENT_TWO = 'document two'

    it('should return the first document if the input contains mutliple document', function () {
      const result = claimSummaryHelper.getBenefitDocument([DOCUMENT_ONE, DOCUMENT_TWO])
      expect(result).toBe(DOCUMENT_ONE)
    })

    it('should return undefined if the input array is empty', function () {
      const result = claimSummaryHelper.getBenefitDocument([])
      expect(result).toBeUndefined()
    })

    it('should return undefined if the input is undefined', function () {
      const result = claimSummaryHelper.getBenefitDocument()
      expect(result).toBeUndefined()
    })
  })

  describe('getDocumentFilePath', function () {
    const FILE_EXTENSION = 'txt'
    const FILE_NAME = `example.${FILE_EXTENSION}`
    const EXPECTED_FILE_NAME = `HwPV-Upload.${FILE_EXTENSION}`

    it('should return an object containing the file name and file path', function () {
      getClaimDocumentFilePathStub.resolves({ Filepath: FILE_NAME })
      return claimSummaryHelper.getDocumentFilePath()
        .then(function (file) {
          expect(file.path).toBe(FILE_NAME)
          expect(file.name).toBe(EXPECTED_FILE_NAME)
        })
    })

    it('should reject promise if the call to getDocumentFilePath rejects', function () {
      getClaimDocumentFilePathStub.rejects()
      return expect(claimSummaryHelper.getDocumentFilePath()).to.be.rejected
    })

    it('should reject promise if there is no filepath returned by getDocumentFilePath call', function () {
      getClaimDocumentFilePathStub.resolves()
      return expect(claimSummaryHelper.getDocumentFilePath()).to.be.rejected
    })
  })
})
