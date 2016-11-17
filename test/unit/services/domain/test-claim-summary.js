const expect = require('chai').expect
const ClaimSummary = require('../../../../app/services/domain/claim-summary')
const ValidationError = require('../../../../app/services/errors/validation-error')
var claimSummary

describe('services/domain/claim-summary', function () {
  const VALID_VISIT_CONFIRMATION = { DocumentStatus: 'uploaded' }
  const VALID_BENEFIT_NO_UPLOAD = 'income-support'
  const VALID_BENEFIT_UPLOAD_NEEDED = 'hc2'
  const VALID_BENEFIT_DOCUMENT = {DocumentStatus: 'uploaded'}
  const INVALID_VISIT_CONFIRMATION = ''
  const INVALID_BENEFIT_DOCUMENT = ''
  const VALID_CLAIM_EXPENSE_DOCUMENT = [{DocumentStatus: 'uploaded'}]
  const INVALID_CLAIM_EXPENSE_DOCUMENT = [{DocumentStatus: null}]

  it('should construct a domain object given valid input', function (done) {
    claimSummary = new ClaimSummary(VALID_VISIT_CONFIRMATION, VALID_BENEFIT_UPLOAD_NEEDED, VALID_BENEFIT_DOCUMENT, VALID_CLAIM_EXPENSE_DOCUMENT)

    expect(claimSummary.visitConfirmationStatus).to.equal(VALID_VISIT_CONFIRMATION.DocumentStatus)
    done()
  })

  it('should construct a domain object given valid input for a benefit that does not need a document', function (done) {
    claimSummary = new ClaimSummary(VALID_VISIT_CONFIRMATION, VALID_BENEFIT_NO_UPLOAD, INVALID_BENEFIT_DOCUMENT, VALID_CLAIM_EXPENSE_DOCUMENT)

    expect(claimSummary.visitConfirmationStatus).to.equal(VALID_VISIT_CONFIRMATION.DocumentStatus)
    done()
  })

  it('should return an isRequired validation error given no visit confirmation', function (done) {
    try {
      claimSummary = new ClaimSummary(INVALID_VISIT_CONFIRMATION, VALID_BENEFIT_UPLOAD_NEEDED, VALID_BENEFIT_DOCUMENT, VALID_CLAIM_EXPENSE_DOCUMENT)
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)

      expect(e.validationErrors['VisitConfirmation'][0]).to.equal('Visit confirmation is required')
    }
    done()
  })

  it('should return an isRequired validation error given no benefit document', function (done) {
    try {
      claimSummary = new ClaimSummary(VALID_VISIT_CONFIRMATION, VALID_BENEFIT_UPLOAD_NEEDED, INVALID_BENEFIT_DOCUMENT, VALID_CLAIM_EXPENSE_DOCUMENT)
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)

      expect(e.validationErrors['benefit-information'][0]).to.equal('Benefit information is required')
    }
    done()
  })

  it('should return an isRequired validation error given no claim expense document', function (done) {
    try {
      claimSummary = new ClaimSummary(VALID_VISIT_CONFIRMATION, VALID_BENEFIT_UPLOAD_NEEDED, VALID_BENEFIT_DOCUMENT, INVALID_CLAIM_EXPENSE_DOCUMENT)
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)

      expect(e.validationErrors['claim-expense'][0]).to.equal('Claim expense receipt is required')
    }
    done()
  })
})
