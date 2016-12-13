var expect = require('chai').expect
const sortViewClaimResultsHelper = require('../../../../app/services/helpers/sort-view-claim-results-helper')

const CLAIM = [[{ClaimId: 1}]]
const ELIGIBILITY = {EligibilityId: 1, FirstName: 'tester'}
const CLAIM_DOCUMENTS = [
  {ClaimDocumentId: 1, DocumentType: 'VISIT-CONFIRMATION'},
  {ClaimDocumentId: 2, DocumentType: 'working-tax-credit'},
  {ClaimDocumentId: 3, DocumentType: 'RECEIPT', ClaimExpenseId: 1}
]
const EXTERNAL_CLAIM_DOCUMENTS = [
  {ClaimDocumentId: 4, DocumentType: 'VISIT-CONFIRMATION'},
  {ClaimDocumentId: 5, DocumentType: 'working-tax-credit'},
  {ClaimDocumentId: 6, DocumentType: 'working-tax-credit'}
]
const CLAIM_EXPENSES = [{ClaimExpenseId: 1, ExpenseType: 'car'}]

var results

describe('services/helpers/sort-view-claim-results-helper', function () {
  it('should add Eligibility information to claim', function () {
    results = [CLAIM, ELIGIBILITY, CLAIM_DOCUMENTS, [], []]
    sortViewClaimResultsHelper(results)
    expect(results[0][0].EligibilityId).to.equal(ELIGIBILITY.EligibilityId)
    expect(results[0][0].FirstName).to.equal(ELIGIBILITY.FirstName)
  })

  it('should add internal claim documents to claim', function () {
    results = [CLAIM, ELIGIBILITY, CLAIM_DOCUMENTS, [], []]
    sortViewClaimResultsHelper(results)
    expect(results[0][0].visitConfirmation.ClaimDocumentId).to.equal(CLAIM_DOCUMENTS[0].ClaimDocumentId)
    expect(results[0][0].benefitDocument[0].ClaimDocumentId).to.equal(CLAIM_DOCUMENTS[1].ClaimDocumentId)
  })

  it('should replace internal documents with external documents', function () {
    results = [CLAIM, ELIGIBILITY, CLAIM_DOCUMENTS, [], EXTERNAL_CLAIM_DOCUMENTS]
    sortViewClaimResultsHelper(results)
    expect(results[0][0].visitConfirmation.ClaimDocumentId).to.equal(EXTERNAL_CLAIM_DOCUMENTS[0].ClaimDocumentId)
    expect(results[0][0].benefitDocument[0].ClaimDocumentId).to.equal(EXTERNAL_CLAIM_DOCUMENTS[2].ClaimDocumentId)
    expect(results[0][0].benefitDocument[1].ClaimDocumentId).to.equal(EXTERNAL_CLAIM_DOCUMENTS[1].ClaimDocumentId)
  })

  it('should add claim document to claim expense', function () {
    results = [CLAIM, ELIGIBILITY, CLAIM_DOCUMENTS, CLAIM_EXPENSES, []]
    sortViewClaimResultsHelper(results)
    expect(results[3][0].ExpenseType).to.equal(CLAIM_EXPENSES[0].ExpenseType)
    expect(results[3][0].DocumentType).to.equal(CLAIM_DOCUMENTS[2].DocumentType)
    expect(results[3][0].fromInternalWeb).to.equal(true)
  })
})
