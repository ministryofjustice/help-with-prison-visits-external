const expect = require('chai').expect
const ClaimSummary = require('../../../../app/services/domain/claim-summary')
const ValidationError = require('../../../../app/services/errors/validation-error')
var claimSummary

describe('services/domain/claim-summary', function () {
  const VALID_VISIT_CONFIRMATION = { DocumentStatus: 'uploaded' }
  const VALID_BENEFIT_NO_UPLOAD = 'income-support'
  const VALID_BENEFIT_UPLOAD_NEEDED = 'hc2'
  const VALID_BENEFIT_DOCUMENT = {DocumentStatus: 'uploaded'}
  const VALID_IS_ADVANCE_CLAIM = false
  const INVALID_VISIT_CONFIRMATION = ''
  const INVALID_BENEFIT_DOCUMENT = ''
  const VALID_CLAIM_EXPENSE_DOCUMENT = [{ExpenseType: 'bus', DocumentStatus: 'uploaded'}]
  const INVALID_CLAIM_EXPENSE_DOCUMENT = [{ExpenseType: 'test', DocumentStatus: null}]

  it('should construct a domain object given valid input', function () {
    claimSummary = new ClaimSummary(VALID_VISIT_CONFIRMATION, VALID_BENEFIT_UPLOAD_NEEDED, VALID_BENEFIT_DOCUMENT, VALID_CLAIM_EXPENSE_DOCUMENT, VALID_IS_ADVANCE_CLAIM)
    expect(claimSummary.visitConfirmationStatus).to.equal(VALID_VISIT_CONFIRMATION.DocumentStatus)
  })

  it('should construct a domain object given valid input for a benefit that does not need a document', function () {
    claimSummary = new ClaimSummary(VALID_VISIT_CONFIRMATION, VALID_BENEFIT_NO_UPLOAD, INVALID_BENEFIT_DOCUMENT, VALID_CLAIM_EXPENSE_DOCUMENT, VALID_IS_ADVANCE_CLAIM)
    expect(claimSummary.visitConfirmationStatus).to.equal(VALID_VISIT_CONFIRMATION.DocumentStatus)
  })

  it('should return an isRequired validation error given no visit confirmation', function () {
    try {
      claimSummary = new ClaimSummary(INVALID_VISIT_CONFIRMATION, VALID_BENEFIT_UPLOAD_NEEDED, VALID_BENEFIT_DOCUMENT, VALID_CLAIM_EXPENSE_DOCUMENT, VALID_IS_ADVANCE_CLAIM)
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)
      expect(e.validationErrors['VisitConfirmation'][0]).to.equal('Visit confirmation is required')
    }
  })

  it('should not return an isRequired validation error given no visit confirmation for advance claim', function () {
    claimSummary = new ClaimSummary(INVALID_VISIT_CONFIRMATION, VALID_BENEFIT_UPLOAD_NEEDED, VALID_BENEFIT_DOCUMENT, VALID_CLAIM_EXPENSE_DOCUMENT, true)
  })

  it('should return an isRequired validation error given no benefit document', function () {
    try {
      claimSummary = new ClaimSummary(VALID_VISIT_CONFIRMATION, VALID_BENEFIT_UPLOAD_NEEDED, INVALID_BENEFIT_DOCUMENT, VALID_CLAIM_EXPENSE_DOCUMENT, VALID_IS_ADVANCE_CLAIM)
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)
      expect(e.validationErrors['benefit-information'][0]).to.equal('Benefit information is required')
    }
  })

  it('should return an isRequired validation error given no claim expense document', function () {
    try {
      claimSummary = new ClaimSummary(VALID_VISIT_CONFIRMATION, VALID_BENEFIT_UPLOAD_NEEDED, VALID_BENEFIT_DOCUMENT, INVALID_CLAIM_EXPENSE_DOCUMENT, VALID_IS_ADVANCE_CLAIM)
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)
      expect(e.validationErrors['claim-expense'][0]).to.equal('Claim expense receipt is required')
    }
  })

  it('should not return an isRequired validation error given no claim expense document for advance claim', function () {
    claimSummary = new ClaimSummary(VALID_VISIT_CONFIRMATION, VALID_BENEFIT_UPLOAD_NEEDED, VALID_BENEFIT_DOCUMENT, INVALID_CLAIM_EXPENSE_DOCUMENT, true)
  })
})
