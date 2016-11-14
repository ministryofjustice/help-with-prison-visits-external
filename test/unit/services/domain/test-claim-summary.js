const expect = require('chai').expect
const ClaimSummary = require('../../../../app/services/domain/claim-summary')
const ValidationError = require('../../../../app/services/errors/validation-error')
var claimSummary

describe('services/domain/claim-summary', function () {
  const VALID_VISIT_CONFIRMATION = { DocumentStatus: 'uploaded' }
  const INVALID_VISIT_CONFIRMATION = ''

  it('should construct a domain object given valid input', function (done) {
    claimSummary = new ClaimSummary(VALID_VISIT_CONFIRMATION)

    expect(claimSummary.visitConfirmationStatus).to.equal(VALID_VISIT_CONFIRMATION.DocumentStatus)
    done()
  })

  it('should return an isRequired validation error given no visit confirmation', function (done) {
    try {
      claimSummary = new ClaimSummary(INVALID_VISIT_CONFIRMATION)
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)

      expect(e.validationErrors['VisitConfirmation'][0]).to.equal('Visit confirmation is required')
    }
    done()
  })
})
