const sortViewClaimResultsHelper = require('../../../../app/services/helpers/sort-view-claim-results-helper')

let claim
let advanceClaim
const claimExpenses = [
  { ClaimExpenseId: 1, ExpenseType: 'car', Cost: 2.2, RequestedCost: 3, Status: 'APPROVED-DIFF-AMOUNT' },
]
const claimExpensesNoStatus = [{ ClaimExpenseId: 1, ExpenseType: 'car', RequestedCost: 3 }]
const ELIGIBILITY = { EligibilityId: 1, FirstName: 'tester' }
const CLAIM_DOCUMENTS = [
  { ClaimDocumentId: 1, DocumentType: 'VISIT-CONFIRMATION' },
  { ClaimDocumentId: 2, DocumentType: 'working-tax-credit' },
  { ClaimDocumentId: 3, DocumentType: 'RECEIPT', ClaimExpenseId: 1 },
]
const EXTERNAL_CLAIM_DOCUMENTS = [
  { ClaimDocumentId: 4, DocumentType: 'VISIT-CONFIRMATION' },
  { ClaimDocumentId: 5, DocumentType: 'working-tax-credit' },
  { ClaimDocumentId: 6, DocumentType: 'working-tax-credit' },
]

describe('services/helpers/sort-view-claim-results-helper', () => {
  it('should add Eligibility information to claim', () => {
    claim = { ClaimId: 1 }
    sortViewClaimResultsHelper(claim, ELIGIBILITY, CLAIM_DOCUMENTS, [], [])
    expect(claim.EligibilityId).toBe(ELIGIBILITY.EligibilityId)
    expect(claim.FirstName).toBe(ELIGIBILITY.FirstName)
  })

  it('should add internal claim documents to claim', () => {
    claim = { ClaimId: 1 }
    sortViewClaimResultsHelper(claim, ELIGIBILITY, CLAIM_DOCUMENTS, [], [])
    expect(claim.visitConfirmation.ClaimDocumentId).toBe(CLAIM_DOCUMENTS[0].ClaimDocumentId)
    expect(claim.benefitDocument[0].ClaimDocumentId).toBe(CLAIM_DOCUMENTS[1].ClaimDocumentId)
  })

  it('should replace internal documents with external documents', () => {
    claim = { ClaimId: 1 }
    sortViewClaimResultsHelper(claim, ELIGIBILITY, CLAIM_DOCUMENTS, [], EXTERNAL_CLAIM_DOCUMENTS)
    expect(claim.visitConfirmation.ClaimDocumentId).toBe(EXTERNAL_CLAIM_DOCUMENTS[0].ClaimDocumentId)
    expect(claim.benefitDocument[0].ClaimDocumentId).toBe(EXTERNAL_CLAIM_DOCUMENTS[2].ClaimDocumentId)
    expect(claim.benefitDocument[1].ClaimDocumentId).toBe(EXTERNAL_CLAIM_DOCUMENTS[1].ClaimDocumentId)
  })

  it('should add claim document to claim expense', () => {
    claim = { ClaimId: 1 }
    sortViewClaimResultsHelper(claim, ELIGIBILITY, CLAIM_DOCUMENTS, claimExpenses, [])
    expect(claimExpenses[0].DocumentType).toBe(CLAIM_DOCUMENTS[2].DocumentType)
    expect(claimExpenses[0].fromInternalWeb).toBe(true)
  })

  it('should add placeholder claim documents when is advance claim and no claim docuemnts returned', () => {
    advanceClaim = { ClaimId: 1, IsAdvanceClaim: true }
    sortViewClaimResultsHelper(advanceClaim, ELIGIBILITY, [], claimExpenses, [])
    expect(advanceClaim.visitConfirmation.DocumentType).toBe('VISIT-CONFIRMATION')
    expect(advanceClaim.visitConfirmation.ClaimDocumentId).toBeUndefined()
    expect(advanceClaim.visitConfirmation.fromInternalWeb).toBe(true)
  })

  it('should not add placeholder documents', () => {
    advanceClaim = { ClaimId: 1, IsAdvanceClaim: true }
    sortViewClaimResultsHelper(advanceClaim, ELIGIBILITY, CLAIM_DOCUMENTS, claimExpenses, [])
    expect(advanceClaim.visitConfirmation.DocumentType).toBe(CLAIM_DOCUMENTS[0].DocumentType)
    expect(advanceClaim.visitConfirmation.ClaimDocumentId).toBe(CLAIM_DOCUMENTS[0].ClaimDocumentId)
    expect(advanceClaim.visitConfirmation.fromInternalWeb).toBe(true)
  })

  it('use requested cost when a claim expense has no status', () => {
    claim = { ClaimId: 1 }
    sortViewClaimResultsHelper(claim, ELIGIBILITY, CLAIM_DOCUMENTS, claimExpensesNoStatus, [])
    expect(claimExpensesNoStatus[0].Cost).toBe(claimExpensesNoStatus[0].RequestedCost)
  })
})
