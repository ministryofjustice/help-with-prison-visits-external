const ViewClaim = require('../../../../app/services/domain/view-claim')
let viewClaim

describe('services/domain/claim-summary', function () {
  const UPDATED_EXPENSES = [{ fromInternalWeb: false }]
  const NOT_UPDATED_EXPENSES = [{ fromInternalWeb: true }]
  const UPDATED_DOCUMENT = false
  const MESSAGE = 'Updated'

  it('should construct a domain object given all updated content and a message', function () {
    viewClaim = new ViewClaim(UPDATED_DOCUMENT, UPDATED_DOCUMENT, UPDATED_EXPENSES, MESSAGE)
    expect(viewClaim.message).toBe(MESSAGE)
  })

  it('should construct a domain object given all updated content and message', function () {
    viewClaim = new ViewClaim(UPDATED_DOCUMENT, UPDATED_DOCUMENT, UPDATED_EXPENSES, MESSAGE)
    expect(viewClaim.message).toBe(MESSAGE)
  })

  it('should construct a domain object given all only expenses updated', function () {
    viewClaim = new ViewClaim(true, true, UPDATED_EXPENSES, '')
    expect(viewClaim.message).toBe('')
    expect(viewClaim.updated).toBe(true)  //eslint-disable-line
  })

  it('should construct a domain object given only a message sent', function () {
    viewClaim = new ViewClaim(true, true, NOT_UPDATED_EXPENSES, MESSAGE)
    expect(viewClaim.message).toBe(MESSAGE)
    expect(viewClaim.updated).toBe(false)  //eslint-disable-line
  })

  it('Throw a validation error if nothing has been updated and there is no message', function () {
    expect(function () {
      viewClaim = new ViewClaim(true, true, NOT_UPDATED_EXPENSES, '').isValid()
    }).toThrow()
  })
})
