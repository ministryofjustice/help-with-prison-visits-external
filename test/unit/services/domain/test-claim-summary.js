/* eslint-disable no-new */
const ClaimSummary = require('../../../../app/services/domain/claim-summary');
const ValidationError = require('../../../../app/services/errors/validation-error')

describe('services/domain/claim-summary', function () {
  const VALID_VISIT_CONFIRMATION = { DocumentStatus: 'uploaded' }
  const VALID_BENEFIT_NO_UPLOAD = 'income-support'

  const VALID_BENEFIT_UPLOAD_NEEDED = 'hc2'
  const VALID_BENEFIT_DOCUMENT = { DocumentStatus: 'uploaded' }

  const IS_FUTURE_CLAIM = true
  const IS_PAST_CLAIM = false

  const INVALID_VISIT_CONFIRMATION = ''
  const INVALID_BENEFIT_DOCUMENT = ''

  const BENEFIT_UPLOAD_NOT_REQUIRED = false

  const VALID_CLAIM_EXPENSE_DOCUMENT = [{ ExpenseType: 'train', DocumentStatus: 'uploaded', Cost: 2 }]
  const INVALID_CLAIM_EXPENSE_DOCUMENT = [{ ExpenseType: 'bus', DocumentStatus: null, Cost: 2 }]
  const INVALID_CLAIM_EXPENSE_COST = [{ ExpenseType: 'train', DocumentStatus: 'uploaded', Cost: 0 }]
  const RECEIPT_NOT_REQUIRED_CLAIM_EXPENSE_DOCUMENT = [{ ExpenseType: 'car', DocumentStatus: null }]

  it('should construct a domain object given valid input', function () {
    const claimSummary = new ClaimSummary(VALID_VISIT_CONFIRMATION, VALID_BENEFIT_UPLOAD_NEEDED, VALID_BENEFIT_DOCUMENT, VALID_CLAIM_EXPENSE_DOCUMENT, IS_PAST_CLAIM, BENEFIT_UPLOAD_NOT_REQUIRED)
    expect(claimSummary.visitConfirmationStatus).toBe(VALID_VISIT_CONFIRMATION.DocumentStatus)
  })

  it('should construct a domain object given valid input for a benefit that does not need a document', function () {
    const claimSummary = new ClaimSummary(VALID_VISIT_CONFIRMATION, VALID_BENEFIT_NO_UPLOAD, INVALID_BENEFIT_DOCUMENT, VALID_CLAIM_EXPENSE_DOCUMENT, IS_PAST_CLAIM, BENEFIT_UPLOAD_NOT_REQUIRED)
    expect(claimSummary.visitConfirmationStatus).toBe(VALID_VISIT_CONFIRMATION.DocumentStatus)
  })

  it('should throw a ValidationError if given no visit confirmation', function () {
    expect(function () {
      new ClaimSummary(INVALID_VISIT_CONFIRMATION, VALID_BENEFIT_UPLOAD_NEEDED, VALID_BENEFIT_DOCUMENT, VALID_CLAIM_EXPENSE_DOCUMENT, IS_PAST_CLAIM, BENEFIT_UPLOAD_NOT_REQUIRED)
    }).toThrow()
  })

  it('should throw a ValidationError if given no visit confirmation for advance claim', function () {
    expect(function () {
      new ClaimSummary(INVALID_VISIT_CONFIRMATION, VALID_BENEFIT_UPLOAD_NEEDED, VALID_BENEFIT_DOCUMENT, VALID_CLAIM_EXPENSE_DOCUMENT, IS_FUTURE_CLAIM, BENEFIT_UPLOAD_NOT_REQUIRED)
    }).not.toThrow(ValidationError)
  })

  it('should throw a ValidationError if given no benefit document', function () {
    expect(function () {
      new ClaimSummary(VALID_VISIT_CONFIRMATION, VALID_BENEFIT_UPLOAD_NEEDED, INVALID_BENEFIT_DOCUMENT, VALID_CLAIM_EXPENSE_DOCUMENT, IS_PAST_CLAIM, BENEFIT_UPLOAD_NOT_REQUIRED)
    }).toThrow()
  })

  it('should throw a ValidationError if given no claim expense document', function () {
    expect(function () {
      new ClaimSummary(VALID_VISIT_CONFIRMATION, VALID_BENEFIT_UPLOAD_NEEDED, VALID_BENEFIT_DOCUMENT, INVALID_CLAIM_EXPENSE_DOCUMENT, IS_PAST_CLAIM, BENEFIT_UPLOAD_NOT_REQUIRED)
    }).toThrow()
  })

  it('should throw a ValidationError if given no claim expenses', function () {
    expect(function () {
      new ClaimSummary(VALID_VISIT_CONFIRMATION, VALID_BENEFIT_UPLOAD_NEEDED, VALID_BENEFIT_DOCUMENT, [], IS_PAST_CLAIM, BENEFIT_UPLOAD_NOT_REQUIRED)
    }).toThrow()
  })

  it('should throw a ValidationError if expense has 0 or less cost', function () {
    expect(function () {
      new ClaimSummary(VALID_VISIT_CONFIRMATION, VALID_BENEFIT_UPLOAD_NEEDED, VALID_BENEFIT_DOCUMENT, INVALID_CLAIM_EXPENSE_COST, IS_PAST_CLAIM, BENEFIT_UPLOAD_NOT_REQUIRED)
    }).toThrow()
  })

  it('should not throw a ValidationError if receipt is required in past claim and provided.', function () {
    expect(function () {
      new ClaimSummary(VALID_VISIT_CONFIRMATION, VALID_BENEFIT_UPLOAD_NEEDED, VALID_BENEFIT_DOCUMENT, RECEIPT_NOT_REQUIRED_CLAIM_EXPENSE_DOCUMENT, IS_PAST_CLAIM, BENEFIT_UPLOAD_NOT_REQUIRED)
    }).not.toThrow(ValidationError)
  })

  it('should not throw a ValidationError given no claim expense document for advance claim', function () {
    expect(function () {
      new ClaimSummary(VALID_VISIT_CONFIRMATION, VALID_BENEFIT_UPLOAD_NEEDED, VALID_BENEFIT_DOCUMENT, INVALID_CLAIM_EXPENSE_DOCUMENT, IS_FUTURE_CLAIM, BENEFIT_UPLOAD_NOT_REQUIRED)
    }).not.toThrow(ValidationError)
  })
})
