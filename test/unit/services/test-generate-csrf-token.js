const generateCsrfToken = require('../../../app/services/generate-csrf-token')

const CSRF_TOKENT = 'some value'

describe('services/generate-csrf-token', function () {
  let request

  beforeEach(function () {
    request = {
      csrfToken: jest.fn()
    }
  })

  it('should return the value of the crsfToken attached to the request object', function () {
    request.csrfToken.mockReturnValue(CSRF_TOKENT)
    const result = generateCsrfToken(request)
    expect(result).toBe(CSRF_TOKENT)
  })
})
