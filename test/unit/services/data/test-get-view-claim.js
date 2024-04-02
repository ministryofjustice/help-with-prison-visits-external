const REFERENCE = 'V123456'
const CLAIMID = 1234
const DOB = '10-10-1990'
const ELIGIBILITYID = 1234

describe('services/data/get-view-claim', function () {
  let getViewClaim
  const mockGetRepeatEligibilityStub = jest.fn()
  const mockGetClaimExpenseByIdOrLastApproved = jest.fn()
  const mockGetClaimChildrenByIdOrLastApproved = jest.fn()
  const mockGetHistoricClaimByClaimId = jest.fn()
  const mockGetClaimDocumentsHistoricClaim = jest.fn()
  const mockGetAllClaimDocumentsByClaimId = jest.fn()
  const mockGetClaimEvents = jest.fn()
  const mockSortViewClaimResultsHelper = jest.fn()

  beforeEach(function () {
    mockGetRepeatEligibilityStub.mockResolvedValue([[]])
    mockGetClaimExpenseByIdOrLastApproved.mockResolvedValue([])
    mockGetClaimChildrenByIdOrLastApproved.mockResolvedValue([])
    mockGetHistoricClaimByClaimId.mockResolvedValue([{ EligibilityId: ELIGIBILITYID }])
    mockGetClaimDocumentsHistoricClaim.mockResolvedValue([])
    mockGetAllClaimDocumentsByClaimId.mockResolvedValue([])
    mockGetClaimEvents.mockResolvedValue([])
    mockSortViewClaimResultsHelper.mockReturnValue([])

    jest.mock('../../../../app/services/data/get-repeat-eligibility', () => mockGetRepeatEligibilityStub)
    jest.mock(
      '../../../../app/services/data/get-claim-expense-by-id-or-last-approved',
      () => mockGetClaimExpenseByIdOrLastApproved
    )
    jest.mock(
      '../../../../app/services/data/get-claim-children-by-id-or-last-approved',
      () => mockGetClaimChildrenByIdOrLastApproved
    )
    jest.mock('../../../../app/services/data/get-historic-claim-by-claim-id', () => mockGetHistoricClaimByClaimId)
    jest.mock(
      '../../../../app/services/data/get-claim-documents-historic-claim',
      () => mockGetClaimDocumentsHistoricClaim
    )
    jest.mock(
      '../../../../app/services/data/get-all-claim-documents-by-claim-id',
      () => mockGetAllClaimDocumentsByClaimId
    )
    jest.mock('../../../../app/services/data/get-claim-events', () => mockGetClaimEvents)
    jest.mock(
      '../../../../app/services/helpers/sort-view-claim-results-helper',
      () => mockSortViewClaimResultsHelper
    )

    getViewClaim = require('../../../../app/services/data/get-view-claim')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should call each data call, then return sorted results', function () {
    return getViewClaim(CLAIMID, REFERENCE, DOB)
      .then(function (result) {
        expect(mockGetRepeatEligibilityStub).toHaveBeenCalledWith(REFERENCE, DOB, null).toBe(true)  //eslint-disable-line
        expect(mockGetClaimExpenseByIdOrLastApproved).toHaveBeenCalledWith(REFERENCE, null, CLAIMID).toBe(true)  //eslint-disable-line
        expect(mockGetClaimChildrenByIdOrLastApproved).toHaveBeenCalledWith(REFERENCE, null, CLAIMID).toBe(true)  //eslint-disable-line
        expect(mockGetHistoricClaimByClaimId).toHaveBeenCalledWith(REFERENCE, DOB, CLAIMID).toBe(true)  //eslint-disable-line
        expect(mockGetClaimDocumentsHistoricClaim).toHaveBeenCalledWith(REFERENCE, ELIGIBILITYID, CLAIMID).toBe(true)  //eslint-disable-line
        expect(mockGetAllClaimDocumentsByClaimId).toHaveBeenCalledWith(CLAIMID, REFERENCE, ELIGIBILITYID).toBe(true)  //eslint-disable-line
        expect(mockSortViewClaimResultsHelper).toHaveBeenCalledTimes(1)
      })
  })
})
