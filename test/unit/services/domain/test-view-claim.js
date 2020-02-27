const expect = require('chai').expect
const ViewClaim = require('../../../../app/services/domain/view-claim')
const ValidationError = require('../../../../app/services/errors/validation-error')
var viewClaim

describe('services/domain/claim-summary', function () {
  const UPDATED_EXPENSES = [{fromInternalWeb: false}]
  const NOT_UPDATED_EXPENSES = [{fromInternalWeb: true}]
  const UPDATED_DOCUMENT = false
  const MESSAGE = 'Updated'

  it('should construct a domain object given all updated content and a message', function () {
    viewClaim = new ViewClaim(UPDATED_DOCUMENT, UPDATED_DOCUMENT, UPDATED_EXPENSES, MESSAGE)
    expect(viewClaim.message).to.be.equal(MESSAGE)
  })

  it('should construct a domain object given all updated content and message', function () {
    viewClaim = new ViewClaim(UPDATED_DOCUMENT, UPDATED_DOCUMENT, UPDATED_EXPENSES, MESSAGE)
    expect(viewClaim.message).to.be.equal(MESSAGE)
  })

  it('should construct a domain object given all only expenses updated', function () {
    viewClaim = new ViewClaim(true, true, UPDATED_EXPENSES, '')
    expect(viewClaim.message).to.be.equal('')
    expect(viewClaim.updated).to.be.true
  })

  it('should construct a domain object given only a message sent', function () {
    viewClaim = new ViewClaim(true, true, NOT_UPDATED_EXPENSES, MESSAGE)
    expect(viewClaim.message).to.be.equal(MESSAGE)
    expect(viewClaim.updated).to.be.false
  })

  it('Throw a validation error if nothing has been updated and there is no message', function () {
    expect(function () {
      viewClaim = new ViewClaim(true, true, NOT_UPDATED_EXPENSES, '').isValid()
    }).to.throw(ValidationError)
  })
})
