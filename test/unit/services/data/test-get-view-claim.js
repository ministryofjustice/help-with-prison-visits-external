const sinon = require('sinon')

const REFERENCE = 'V123456'
const CLAIMID = 1234
const DOB = '10-10-1990'
const ELIGIBILITYID = 1234

jest.mock('./get-repeat-eligibility', () => mockGetRepeatEligibilityStub)

jest.mock(
  './get-claim-expense-by-id-or-last-approved',
  () => getClaimExpenseByIdOrLastApprovedStub
)

jest.mock(
  './get-claim-children-by-id-or-last-approved',
  () => getClaimChildrenByIdOrLastApprovedStub
)

jest.mock('./get-historic-claim-by-claim-id', () => getHistoricClaimByClaimIdStub)

jest.mock(
  './get-claim-documents-historic-claim',
  () => getClaimDocumentsHistoricClaimStub
)

jest.mock(
  './get-all-claim-documents-by-claim-id',
  () => getAllClaimDocumentsByClaimIdStub
)

jest.mock('./get-claim-events', () => getClaimEventsStub)

jest.mock(
  '../helpers/sort-view-claim-results-helper',
  () => sortViewClaimResultsHelperStub
)

describe('services/data/get-view-claim', function () {
  let getViewClaim
  let mockGetRepeatEligibilityStub
  let getClaimExpenseByIdOrLastApprovedStub
  let getClaimChildrenByIdOrLastApprovedStub
  let getHistoricClaimByClaimIdStub
  let getClaimDocumentsHistoricClaimStub
  let getAllClaimDocumentsByClaimIdStub
  let getClaimEventsStub
  let sortViewClaimResultsHelperStub

  beforeAll(function () {
    mockGetRepeatEligibilityStub = jest.fn().mockResolvedValue([[]])
    getClaimExpenseByIdOrLastApprovedStub = jest.fn().mockResolvedValue([])
    getClaimChildrenByIdOrLastApprovedStub = jest.fn().mockResolvedValue([])
    getHistoricClaimByClaimIdStub = jest.fn().mockResolvedValue([{ EligibilityId: ELIGIBILITYID }])
    getClaimDocumentsHistoricClaimStub = jest.fn().mockResolvedValue([])
    getAllClaimDocumentsByClaimIdStub = jest.fn().mockResolvedValue([])
    getClaimEventsStub = jest.fn().mockResolvedValue([])
    sortViewClaimResultsHelperStub = jest.fn().mockReturnValue([])

    getViewClaim = require('../../../../app/services/data/get-view-claim')
  })

  it('should call each data call, then return sorted results', function () {
    return getViewClaim(CLAIMID, REFERENCE, DOB)
      .then(function (result) {
        expect(mockGetRepeatEligibilityStub.hasBeenCalledWith(REFERENCE, DOB, null)).toBe(true)  //eslint-disable-line
        expect(getClaimExpenseByIdOrLastApprovedStub.hasBeenCalledWith(REFERENCE, null, CLAIMID)).toBe(true)  //eslint-disable-line
        expect(getClaimChildrenByIdOrLastApprovedStub.hasBeenCalledWith(REFERENCE, null, CLAIMID)).toBe(true)  //eslint-disable-line
        expect(getHistoricClaimByClaimIdStub.hasBeenCalledWith(REFERENCE, DOB, CLAIMID)).toBe(true)  //eslint-disable-line
        expect(getClaimDocumentsHistoricClaimStub.hasBeenCalledWith(REFERENCE, ELIGIBILITYID, CLAIMID)).toBe(true)  //eslint-disable-line
        expect(getAllClaimDocumentsByClaimIdStub.hasBeenCalledWith(CLAIMID, REFERENCE, ELIGIBILITYID)).toBe(true)  //eslint-disable-line
        sinon.toHaveBeenCalledTimes(1)
      })
  })
})
