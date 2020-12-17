const expect = require('chai').expect
const sinon = require('sinon')
const generateCsrfToken = require('../../../app/services/generate-csrf-token')

const CSRF_TOKENT = 'some value'

describe('services/generate-csrf-token', function () {
  let request

  beforeEach(function () {
    request = {
      csrfToken: sinon.stub()
    }
  })

  it('should return the value of the crsfToken attached to the request object', function () {
    request.csrfToken.returns(CSRF_TOKENT)
    const result = generateCsrfToken(request)
    expect(result).to.equal(CSRF_TOKENT)
  })
})
