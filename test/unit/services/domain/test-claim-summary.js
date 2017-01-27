const expect = require('chai').expect
const ClaimSummary = require('../../../../app/services/domain/claim-summary')
const ValidationError = require('../../../../app/services/errors/validation-error')

/* eslint-disable no-new */

describe('services/domain/claim-summary', function () {
  const VALID_VISIT_CONFIRMATION = { DocumentStatus: 'uploaded' }
  const VALID_BENEFIT_NO_UPLOAD = 'income-support'
  const VALID_BENEFIT_UPLOAD_NEEDED = 'hc2'
  const VALID_BENEFIT_DOCUMENT = { DocumentStatus: 'uploaded' }
  const VALID_IS_ADVANCE_CLAIM = false
  const INVALID_VISIT_CONFIRMATION = ''
  const INVALID_BENEFIT_DOCUMENT = ''
  const BENEFIT_UPLOAD_NOT_REQUIRED = false
  const VALID_CLAIM_EXPENSE_DOCUMENT = [ { ExpenseType: 'bus', DocumentStatus: 'uploaded' } ]
  const INVALID_CLAIM_EXPENSE_DOCUMENT = [ { ExpenseType: 'bus', DocumentStatus: null } ]

  it('should construct a domain object given valid input', function () {
    var claimSummary = new ClaimSummary(VALID_VISIT_CONFIRMATION, VALID_BENEFIT_UPLOAD_NEEDED, VALID_BENEFIT_DOCUMENT, VALID_CLAIM_EXPENSE_DOCUMENT, VALID_IS_ADVANCE_CLAIM, BENEFIT_UPLOAD_NOT_REQUIRED)
    expect(claimSummary.visitConfirmationStatus).to.equal(VALID_VISIT_CONFIRMATION.DocumentStatus)
  })

  it('should construct a domain object given valid input for a benefit that does not need a document', function () {
    var claimSummary = new ClaimSummary(VALID_VISIT_CONFIRMATION, VALID_BENEFIT_NO_UPLOAD, INVALID_BENEFIT_DOCUMENT, VALID_CLAIM_EXPENSE_DOCUMENT, VALID_IS_ADVANCE_CLAIM, BENEFIT_UPLOAD_NOT_REQUIRED)
    expect(claimSummary.visitConfirmationStatus).to.equal(VALID_VISIT_CONFIRMATION.DocumentStatus)
  })

  it('should return an isRequired validation error given no visit confirmation', function () {
    expect(function () {
      new ClaimSummary(INVALID_VISIT_CONFIRMATION, VALID_BENEFIT_UPLOAD_NEEDED, VALID_BENEFIT_DOCUMENT, VALID_CLAIM_EXPENSE_DOCUMENT, VALID_IS_ADVANCE_CLAIM, BENEFIT_UPLOAD_NOT_REQUIRED)
    }).to.throw(ValidationError)
  })

  it('should not return an isRequired validation error given no visit confirmation for advance claim', function () {
    expect(function () {
      new ClaimSummary(INVALID_VISIT_CONFIRMATION, VALID_BENEFIT_UPLOAD_NEEDED, VALID_BENEFIT_DOCUMENT, VALID_CLAIM_EXPENSE_DOCUMENT, true, BENEFIT_UPLOAD_NOT_REQUIRED)
    }).to.not.throw(ValidationError)
  })

  it('should return an isRequired validation error given no benefit document', function () {
    expect(function () {
      new ClaimSummary(VALID_VISIT_CONFIRMATION, VALID_BENEFIT_UPLOAD_NEEDED, INVALID_BENEFIT_DOCUMENT, VALID_CLAIM_EXPENSE_DOCUMENT, VALID_IS_ADVANCE_CLAIM, BENEFIT_UPLOAD_NOT_REQUIRED)
    }).to.throw(ValidationError)
  })

  it('should return an isRequired validation error given no claim expense document', function () {
    expect(function () {
      new ClaimSummary(VALID_VISIT_CONFIRMATION, VALID_BENEFIT_UPLOAD_NEEDED, VALID_BENEFIT_DOCUMENT, INVALID_CLAIM_EXPENSE_DOCUMENT, VALID_IS_ADVANCE_CLAIM, BENEFIT_UPLOAD_NOT_REQUIRED)
    }).to.throw(ValidationError)
  })

  it('should return a validation error given no claim expenses', function () {
    expect(function () {
      new ClaimSummary(VALID_VISIT_CONFIRMATION, VALID_BENEFIT_UPLOAD_NEEDED, VALID_BENEFIT_DOCUMENT, [], VALID_IS_ADVANCE_CLAIM, BENEFIT_UPLOAD_NOT_REQUIRED)
    }).to.throw(ValidationError)
  })

  it('should not return an isRequired validation error given no claim expense document for advance claim', function () {
    expect(function () {
      new ClaimSummary(VALID_VISIT_CONFIRMATION, VALID_BENEFIT_UPLOAD_NEEDED, VALID_BENEFIT_DOCUMENT, INVALID_CLAIM_EXPENSE_DOCUMENT, true, BENEFIT_UPLOAD_NOT_REQUIRED)
    }).to.not.throw(ValidationError)
  })
})
