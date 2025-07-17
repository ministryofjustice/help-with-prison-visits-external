const CLAIM_TYPE = 'first-time'
const REFERENCE = '12345'
const CLAIM_ID = '39725'
const CLAIM_EXPENSE_ID = '156'
const CLAIM_DOCUMENT_ID = '98765'

const PARAMS = {
  claimType: CLAIM_TYPE,
  referenceId: REFERENCE,
  claimId: CLAIM_ID,
}

const MULTIPAGE_DOCUMENT = {
  params: PARAMS,
  query: {
    multipage: true,
    document: CLAIM_DOCUMENT_ID,
  },
}

const SINGLEPAGE_DOCUMENT_WITH_CLAIM_EXPENSE_ID = {
  params: PARAMS,
  query: {
    claimExpenseId: CLAIM_EXPENSE_ID,
    document: CLAIM_DOCUMENT_ID,
  },
}

const SINGLEPAGE_DOCUMENT_WITHOUT_CLAIM_EXPENSE_ID = {
  params: PARAMS,
  query: {
    document: CLAIM_DOCUMENT_ID,
  },
}

describe('routes/helpers/claim-summary-helper', () => {
  let claimSummaryHelper
  const mockRemoveClaimExpense = jest.fn()
  const mockRemoveClaimDocument = jest.fn()
  const mockGetClaimDocumentFilePath = jest.fn()

  beforeEach(() => {
    jest.mock('../../../../app/services/data/remove-claim-expense', () => mockRemoveClaimExpense)
    jest.mock('../../../../app/services/data/remove-claim-document', () => mockRemoveClaimDocument)
    jest.mock('../../../../app/services/data/get-claim-document-file-path', () => mockGetClaimDocumentFilePath)

    claimSummaryHelper = require('../../../../app/routes/helpers/claim-summary-helper')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('buildClaimSummaryUrl', () => {
    it('should return claim summary URL constaining the claim type, reference, and claim id', () => {
      const result = claimSummaryHelper.buildClaimSummaryUrl(MULTIPAGE_DOCUMENT)
      expect(result).toBe('/apply/eligibility/claim/summary')
    })
  })

  describe('buildRemoveDocumentUrl', () => {
    it('should return the claim summary url if the document is multipage', () => {
      const result = claimSummaryHelper.buildRemoveDocumentUrl(MULTIPAGE_DOCUMENT)
      expect(result).toBe('/apply/eligibility/claim/summary')
    })

    it('should return the file upload url if the document is single page and claim expense id is set', () => {
      const result = claimSummaryHelper.buildRemoveDocumentUrl(SINGLEPAGE_DOCUMENT_WITH_CLAIM_EXPENSE_ID)
      expect(result).toBe(
        `/apply/eligibility/claim/summary/file-upload?document=${CLAIM_DOCUMENT_ID}&claimExpenseId=${CLAIM_EXPENSE_ID}`,
      )
    })

    it('should return the file upload url if the document is single page and the claim expense id is not set', () => {
      const result = claimSummaryHelper.buildRemoveDocumentUrl(SINGLEPAGE_DOCUMENT_WITHOUT_CLAIM_EXPENSE_ID)
      expect(result).toBe(`/apply/eligibility/claim/summary/file-upload?document=${CLAIM_DOCUMENT_ID}`)
    })
  })

  describe('removeExpense', () => {
    it('should call removeExpense with the given parameters', () => {
      claimSummaryHelper.removeExpense(CLAIM_ID, CLAIM_EXPENSE_ID)
      expect(mockRemoveClaimExpense).toHaveBeenCalledTimes(1)
      expect(mockRemoveClaimExpense).toHaveBeenCalledWith(CLAIM_ID, CLAIM_EXPENSE_ID)
    })
  })

  describe('removeDocument', () => {
    it('should call removeDocument with the given parameters', () => {
      claimSummaryHelper.removeDocument(CLAIM_DOCUMENT_ID)
      expect(mockRemoveClaimDocument).toHaveBeenCalledTimes(1)
      expect(mockRemoveClaimDocument).toHaveBeenCalledWith(CLAIM_DOCUMENT_ID)
    })
  })

  describe('getBenefitDocument', () => {
    const DOCUMENT_ONE = 'document one'
    const DOCUMENT_TWO = 'document two'

    it('should return the first document if the input contains mutliple document', () => {
      const result = claimSummaryHelper.getBenefitDocument([DOCUMENT_ONE, DOCUMENT_TWO])
      expect(result).toBe(DOCUMENT_ONE)
    })

    it('should return undefined if the input array is empty', () => {
      const result = claimSummaryHelper.getBenefitDocument([])
      expect(result).toBeUndefined()
    })

    it('should return undefined if the input is undefined', () => {
      const result = claimSummaryHelper.getBenefitDocument()
      expect(result).toBeUndefined()
    })
  })

  describe('getDocumentFilePath', () => {
    const FILE_EXTENSION = 'txt'
    const FILE_NAME = `example.${FILE_EXTENSION}`
    const EXPECTED_FILE_NAME = `HwPV-Upload.${FILE_EXTENSION}`

    it('should return an object containing the file name and file path', () => {
      mockGetClaimDocumentFilePath.mockResolvedValue({ Filepath: FILE_NAME })
      return claimSummaryHelper.getDocumentFilePath().then(file => {
        expect(file.path).toBe(FILE_NAME)
        expect(file.name).toBe(EXPECTED_FILE_NAME)
      })
    })

    it('should reject promise if the call to getDocumentFilePath rejects', () => {
      mockGetClaimDocumentFilePath.mockRejectedValue()
      return expect(claimSummaryHelper.getDocumentFilePath()).rejects.toThrow()
    })

    it('should reject promise if there is no filepath returned by getDocumentFilePath call', () => {
      mockGetClaimDocumentFilePath.mockResolvedValue()
      return expect(claimSummaryHelper.getDocumentFilePath()).rejects.toThrow()
    })
  })
})
