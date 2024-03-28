const REFERENCE = 'V123456'
const CLAIMID = 1234
const DOB = '10-10-1990'
const ELIGIBILITYID = 1234

jest.mock('../../../../app/services/data/get-repeat-eligibility', () => mockGetRepeatEligibilityStub)
jest.mock(
  '../../../../app/services/data/get-claim-expense-by-id-or-last-approved',
  () => mockGetClaimExpenseByIdOrLastApproved
)
jest.mock(
  '../../../../app/services/data/get-claim-children-by-id-or-last-approved',
  () => mockGetClaimChildrenByIdOrLastApproved
)
jest.mock('./get-historic-claim-by-claim-id', () => mockGetHistoricClaimByClaimId)
jest.mock(
  './get-claim-documents-historic-claim',
  () => mockGetClaimDocumentsHistoricClaim
)
jest.mock(
  './get-all-claim-documents-by-claim-id',
  () => mockGetAllClaimDocumentsByClaimId
)
jest.mock('./get-claim-events', () => mockGetClaimEvents)
jest.mock(
  '../helpers/sort-view-claim-results-helper',
  () => mockSortViewClaimResultsHelper
)

describe('services/data/get-view-claim', function () {
  let getViewClaim
  let mockGetRepeatEligibilityStub = jest.fn()
  let mockGetClaimExpenseByIdOrLastApproved = jest.fn()
  let mockGetClaimChildrenByIdOrLastApproved = jest.fn()
  let mockGetHistoricClaimByClaimId = jest.fn()
  let mockGetClaimDocumentsHistoricClaim = jest.fn()
  let mockGetAllClaimDocumentsByClaimId = jest.fn()
  let mockGetClaimEvents = jest.fn()
  let mockSortViewClaimResultsHelper = jest.fn()

  beforeEach(function () {
    mockGetRepeatEligibilityStub.mockResolvedValue([[]])
    mockGetClaimExpenseByIdOrLastApproved.mockResolvedValue([])
    mockGetClaimChildrenByIdOrLastApproved.mockResolvedValue([])
    mockGetHistoricClaimByClaimId.mockResolvedValue([{ EligibilityId: ELIGIBILITYID }])
    mockGetClaimDocumentsHistoricClaim.mockResolvedValue([])
    mockGetAllClaimDocumentsByClaimId.mockResolvedValue([])
    mockGetClaimEvents.mockResolvedValue([])
    mockSortViewClaimResultsHelper.mockReturnValue([])

    getViewClaim = require('../../../../app/services/data/get-view-claim')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should call each data call, then return sorted results', function () {
    return getViewClaim(CLAIMID, REFERENCE, DOB)
      .then(function (result) {
        expect(mockGetRepeatEligibilityStub.hasBeenCalledWith(REFERENCE, DOB, null)).toBe(true)  //eslint-disable-line
        expect(mockGetClaimExpenseByIdOrLastApproved.hasBeenCalledWith(REFERENCE, null, CLAIMID)).toBe(true)  //eslint-disable-line
        expect(mockGetClaimChildrenByIdOrLastApproved.hasBeenCalledWith(REFERENCE, null, CLAIMID)).toBe(true)  //eslint-disable-line
        expect(mockGetHistoricClaimByClaimId.hasBeenCalledWith(REFERENCE, DOB, CLAIMID)).toBe(true)  //eslint-disable-line
        expect(mockGetClaimDocumentsHistoricClaim.hasBeenCalledWith(REFERENCE, ELIGIBILITYID, CLAIMID)).toBe(true)  //eslint-disable-line
        expect(mockGetAllClaimDocumentsByClaimId.hasBeenCalledWith(CLAIMID, REFERENCE, ELIGIBILITYID)).toBe(true)  //eslint-disable-line
        sinon.toHaveBeenCalledTimes(1)
      })
  })
})
