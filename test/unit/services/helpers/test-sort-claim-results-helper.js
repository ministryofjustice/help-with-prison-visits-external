var expect = require('chai').expect
const sortViewClaimResultsHelper = require('../../../../app/services/helpers/sort-view-claim-results-helper')

var claim
var advanceClaim
var claimExpenses = [{ClaimExpenseId: 1, ExpenseType: 'car'}]
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

describe('services/helpers/sort-view-claim-results-helper', function () {
  it('should add Eligibility information to claim', function () {
    claim = {ClaimId: 1}
    sortViewClaimResultsHelper(claim, ELIGIBILITY, CLAIM_DOCUMENTS, [], [])
    expect(claim.EligibilityId).to.equal(ELIGIBILITY.EligibilityId)
    expect(claim.FirstName).to.equal(ELIGIBILITY.FirstName)
  })

  it('should add internal claim documents to claim', function () {
    claim = {ClaimId: 1}
    sortViewClaimResultsHelper(claim, ELIGIBILITY, CLAIM_DOCUMENTS, [], [])
    expect(claim.visitConfirmation.ClaimDocumentId).to.equal(CLAIM_DOCUMENTS[0].ClaimDocumentId)
    expect(claim.benefitDocument[0].ClaimDocumentId).to.equal(CLAIM_DOCUMENTS[1].ClaimDocumentId)
  })

  it('should replace internal documents with external documents', function () {
    claim = {ClaimId: 1}
    sortViewClaimResultsHelper(claim, ELIGIBILITY, CLAIM_DOCUMENTS, [], EXTERNAL_CLAIM_DOCUMENTS)
    expect(claim.visitConfirmation.ClaimDocumentId).to.equal(EXTERNAL_CLAIM_DOCUMENTS[0].ClaimDocumentId)
    expect(claim.benefitDocument[0].ClaimDocumentId).to.equal(EXTERNAL_CLAIM_DOCUMENTS[2].ClaimDocumentId)
    expect(claim.benefitDocument[1].ClaimDocumentId).to.equal(EXTERNAL_CLAIM_DOCUMENTS[1].ClaimDocumentId)
  })

  it('should add claim document to claim expense', function () {
    claim = {ClaimId: 1}
    sortViewClaimResultsHelper(claim, ELIGIBILITY, CLAIM_DOCUMENTS, claimExpenses, [])
    expect(claimExpenses[0].DocumentType).to.equal(CLAIM_DOCUMENTS[2].DocumentType)
    expect(claimExpenses[0].fromInternalWeb).to.equal(true)
  })

  it('should add placeholder claim documents when is advance claim and no claim docuemnts returned', function () {
    advanceClaim = {ClaimId: 1, IsAdvanceClaim: true}
    sortViewClaimResultsHelper(advanceClaim, ELIGIBILITY, [], claimExpenses, [])
    expect(advanceClaim.visitConfirmation.DocumentType).to.equal('VISIT-CONFIRMATION')
    expect(advanceClaim.visitConfirmation.ClaimDocumentId).to.equal(undefined)
    expect(advanceClaim.visitConfirmation.fromInternalWeb).to.equal(true)
  })

  it('should not add placeholder documents', function () {
    advanceClaim = {ClaimId: 1, IsAdvanceClaim: true}
    sortViewClaimResultsHelper(advanceClaim, ELIGIBILITY, CLAIM_DOCUMENTS, claimExpenses, [])
    expect(advanceClaim.visitConfirmation.DocumentType).to.equal(CLAIM_DOCUMENTS[0].DocumentType)
    expect(advanceClaim.visitConfirmation.ClaimDocumentId).to.equal(CLAIM_DOCUMENTS[0].ClaimDocumentId)
    expect(advanceClaim.visitConfirmation.fromInternalWeb).to.equal(true)
  })
})
