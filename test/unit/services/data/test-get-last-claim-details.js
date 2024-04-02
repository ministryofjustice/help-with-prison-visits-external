const REFERENCE = 'LASTCD1'
const ELIGIBILITYID = '1234'
const LAST_NAME = 'Bloggs'
const LAST_NAME_MASKED = 'B*****'

const CLAIMID = [{ ClaimId: 1, IsAdvanceClaim: false }]
const CHILDREN = [{ ClaimChildId: 1, LastName: LAST_NAME }]
const EXPENSES = [{ ClaimExpenseId: 2, ExpenseType: 'bus', Cost: '20' }, { ClaimExpenseId: 3, ExpenseType: 'taxi', Cost: '15' }, { ClaimExpenseId: 4, ExpenseType: 'train', Cost: '10' }, { ClaimExpenseId: 5, ExpenseType: 'train', Cost: '5' }]
const ESCORT = [{ ClaimEscortId: 3, LastName: LAST_NAME }]
const CLAIMID2 = [{ ClaimId: 2, IsAdvanceClaim: true }]

const mockGetLastClaimForReference = jest.fn()
const mockGetClaimChildrenByIdOrLastApproved = jest.fn()
const mockGetClaimExpenseByIdOrLastApproved = jest.fn()
const mockGetClaimEscortByIdOrLastApproved = jest.fn()
const mockMaskArrayOfNames = jest.fn()
let getLastClaimDetails

describe('services/data/get-last-claim-details', function () {
  beforeEach(() => {
    mockGetClaimChildrenByIdOrLastApproved.mockResolvedValue(CHILDREN)
    mockGetClaimExpenseByIdOrLastApproved.mockResolvedValue(EXPENSES)
    mockGetClaimEscortByIdOrLastApproved.mockResolvedValue(ESCORT)
    mockMaskArrayOfNames.mockReturnValue(LAST_NAME_MASKED)

    jest.mock('../../../../app/services/data/get-last-claim-for-reference', () => mockGetLastClaimForReference)
    jest.mock(
      '../../../../app/services/data/get-claim-children-by-id-or-last-approved',
      () => mockGetClaimChildrenByIdOrLastApproved
    )
    jest.mock(
      '../../../../app/services/data/get-claim-expense-by-id-or-last-approved',
      () => mockGetClaimExpenseByIdOrLastApproved
    )
    jest.mock(
      '../../../../app/services/data/get-claim-escort-by-id-or-last-approved',
      () => mockGetClaimEscortByIdOrLastApproved
    )
    jest.mock('../../../../app/services/helpers/mask-array-of-names', () => mockMaskArrayOfNames)

    getLastClaimDetails = require('../../../../app/services/data/get-last-claim-details')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should call to get last claim children and last claim expenses', function () {
    mockGetLastClaimForReference.mockResolvedValue(CLAIMID)
    return getLastClaimDetails(REFERENCE, ELIGIBILITYID, false, false)
      .then(function (result) {
        expect(mockGetLastClaimForReference).hasBeenCalledWith(REFERENCE, ELIGIBILITYID)
        expect(mockGetClaimChildrenByIdOrLastApproved).hasBeenCalledWith(REFERENCE, ELIGIBILITYID, CLAIMID[0].ClaimId)
        expect(mockGetClaimExpenseByIdOrLastApproved).hasBeenCalledWith(REFERENCE, ELIGIBILITYID, CLAIMID[0].ClaimId)
        expect(mockGetClaimEscortByIdOrLastApproved).hasBeenCalledWith(REFERENCE, ELIGIBILITYID, CLAIMID[0].ClaimId)
        expect(mockMaskArrayOfNames).not.toHaveBeenCalled()

        expect(result.children).toBe(CHILDREN)
        expect(result.expenses).toBe(EXPENSES)
        expect(result.escort).toBe(ESCORT)
      })
  })

  it('should mask child last name and escort last name if mask is true', function () {
    mockGetLastClaimForReference.mockResolvedValue(CLAIMID)
    return getLastClaimDetails(REFERENCE, ELIGIBILITYID, true, false)
      .then(function (result) {
        expect(mockGetLastClaimForReference).hasBeenCalledWith(REFERENCE, ELIGIBILITYID)
        expect(mockGetClaimChildrenByIdOrLastApproved).hasBeenCalledWith(REFERENCE, ELIGIBILITYID, CLAIMID[0].ClaimId)
        expect(mockGetClaimExpenseByIdOrLastApproved).hasBeenCalledWith(REFERENCE, ELIGIBILITYID, CLAIMID[0].ClaimId)
        expect(mockGetClaimEscortByIdOrLastApproved).hasBeenCalledWith(REFERENCE, ELIGIBILITYID, CLAIMID[0].ClaimId)
        expect(mockMaskArrayOfNames).hasBeenCalledWith(CHILDREN)
        expect(mockMaskArrayOfNames).hasBeenCalledWith(ESCORT)
      })
  })

  it('should get last claim and remove train expenses if last claim type is not the same as this claim type', function () {
    mockGetLastClaimForReference.mockResolvedValue(CLAIMID)
    return getLastClaimDetails(REFERENCE, ELIGIBILITYID, false, true)
      .then(function (result) {
        expect(result.expenses.filter(expense => expense.ExpenseType === 'train').length).toBe(0)
        expect(result.expenses.length).toBe(2)
      })
  })

  it('should get last claim and keep train expenses if last claim type is the same as this claim type', function () {
    mockGetLastClaimForReference.mockResolvedValue(CLAIMID)
    return getLastClaimDetails(REFERENCE, ELIGIBILITYID, false, false)
      .then(function (result) {
        expect(result.expenses.filter(expense => expense.ExpenseType === 'train').length).toBe(2)
        expect(result.expenses.length).toBe(4)
      })
  })

  it('should get last claim and reset train expenses to zero if last claim type is the same as this claim type', function () {
    mockGetLastClaimForReference.mockResolvedValue(CLAIMID2)
    return getLastClaimDetails(REFERENCE, ELIGIBILITYID, false, true)
      .then(function (result) {
        const trainExpenses = result.expenses.filter(expense => expense.ExpenseType === 'train')

        trainExpenses.forEach(function (expense) {
          expect(expense.Cost).toBe('0')
        })

        expect(result.expenses.filter(expense => expense.ExpenseType === 'train').length).toBe(2)
        expect(result.expenses.length).toBe(4)
      })
  })
})
