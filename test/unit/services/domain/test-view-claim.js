const expect = require('chai').expect
const ViewClaim = require('../../../../app/services/domain/view-claim')
const ValidationError = require('../../../../app/services/errors/validation-error')
var viewClaim

describe('services/domain/claim-summary', function () {
  const UPDATED_EXPENSES = [{fromInternalWeb: false}]
  const NOT_UPDATED_EXPENSES = [{fromInternalWeb: true}]
  const UPDATED_DOCUMENT = false
  const MESSAGE = 'Updated'
  const NO_BANK_DETAILS = { required: false }
  const VALID_BANK_DETAILS = { accountNumber: '11223344', sortCode: '112233', required: true }
  const INVALID_BANK_DETAILS = { accountNumber: 'ABCDEFG', sortCode: '', required: true }

  it('should construct a domain object given all updated content and a message', function () {
    viewClaim = new ViewClaim(UPDATED_DOCUMENT, UPDATED_DOCUMENT, UPDATED_EXPENSES, MESSAGE, NO_BANK_DETAILS)
    expect(viewClaim.message).to.be.equal(MESSAGE)
  })

  it('should construct a domain object given all updated content, bank details and message', function () {
    viewClaim = new ViewClaim(UPDATED_DOCUMENT, UPDATED_DOCUMENT, UPDATED_EXPENSES, MESSAGE, VALID_BANK_DETAILS)
    expect(viewClaim.message).to.be.equal(MESSAGE)
    expect(viewClaim.bankDetails.sortCode).to.be.equal(VALID_BANK_DETAILS.sortCode)
    expect(viewClaim.bankDetails.accountNumber).to.be.equal(VALID_BANK_DETAILS.accountNumber)
    expect(viewClaim.bankDetails.required).to.be.equal(VALID_BANK_DETAILS.required)
  })

  it('should throw a validation error if Bank Details are required, but invalid', function () {
    expect(function () {
      viewClaim = new ViewClaim(UPDATED_DOCUMENT, UPDATED_DOCUMENT, UPDATED_EXPENSES, MESSAGE, INVALID_BANK_DETAILS).isValid()
    }).to.throw(ValidationError)
  })

  it('should construct a domain object given all only expenses updated', function () {
    viewClaim = new ViewClaim(true, true, UPDATED_EXPENSES, '', NO_BANK_DETAILS)
    expect(viewClaim.message).to.be.equal('')
    expect(viewClaim.updated).to.be.true
  })

  it('should construct a domain object given only a message sent', function () {
    viewClaim = new ViewClaim(true, true, NOT_UPDATED_EXPENSES, MESSAGE, NO_BANK_DETAILS)
    expect(viewClaim.message).to.be.equal(MESSAGE)
    expect(viewClaim.updated).to.be.false
  })

  it('Throw a validation error if nothing has been updated and there is no message', function () {
    expect(function () {
      viewClaim = new ViewClaim(true, true, NOT_UPDATED_EXPENSES, '', NO_BANK_DETAILS).isValid()
    }).to.throw(ValidationError)
  })
})
