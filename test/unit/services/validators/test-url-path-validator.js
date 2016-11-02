const expect = require('chai').expect
const UrlPathValidator = require('../../../../app/services/validators/url-path-validator')

describe('services/validators/url-path-validator', function () {
  const VALID_DOB = { dob: '1989-04-11' }
  const INVALID_DOB = { dob: 'invalid' }

  const VALID_RELATIONSHIP = { relationship: 'partner' }
  const INVALID_RELATIONSHIP = { relationship: 'invalid' }

  const VALID_BENEFIT = { benefit: 'income-support' }
  const INVALID_BENEFIT = { benefit: 'invalid' }

  const VALID_REFERENCE = { reference: '49CCADM' }
  const INVALID_REFERENCE = { reference: 'invalid' }

  const VALID_CLAIMID = { claimId: '123' }
  const INVALID_CLAIMID = { claimId: 'invalid' }

  it('should throw error if passed null', function () {
    return expect(function () {
      UrlPathValidator.validate(null)
    }).to.throw(TypeError)
  })

  it('should throw error if passed undefined', function () {
    return expect(function () {
      UrlPathValidator.validate(undefined)
    }).to.throw(TypeError)
  })

  it('should throw Error if passed an invalid dob value', function () {
    return expect(function () {
      UrlPathValidator.validate(INVALID_DOB)
    }).to.throw(Error)
  })

  it('should throw Error if passed an invalid relationship value', function () {
    return expect(function () {
      UrlPathValidator.validate(INVALID_RELATIONSHIP)
    }).to.throw(Error)
  })

  it('should throw Error if passed an invalid benefit value', function () {
    return expect(function () {
      UrlPathValidator.validate(INVALID_BENEFIT)
    }).to.throw(Error)
  })

  it('should throw Error if passed an invalid reference value', function () {
    return expect(function () {
      UrlPathValidator.validate(INVALID_REFERENCE)
    }).to.throw(Error)
  })

  it('should throw Error if passed an invalid claimId value', function () {
    return expect(function () {
      UrlPathValidator.validate(INVALID_CLAIMID)
    }).to.throw(Error)
  })

  it('should return undefined if passed a valid dob value', function () {
    var result = UrlPathValidator.validate(VALID_DOB)
    return expect(result).to.equal(undefined)
  })

  it('should return undefined if passed a valid relationship value', function () {
    var result = UrlPathValidator.validate(VALID_RELATIONSHIP)
    return expect(result).to.equal(undefined)
  })

  it('should return undefined if passed a valid dob value', function () {
    var result = UrlPathValidator.validate(VALID_DOB)
    return expect(result).to.equal(undefined)
  })

  it('should return undefined if passed a valid benefit value', function () {
    var result = UrlPathValidator.validate(VALID_BENEFIT)
    return expect(result).to.equal(undefined)
  })

  it('should return undefined if passed a valid reference value', function () {
    var result = UrlPathValidator.validate(VALID_REFERENCE)
    return expect(result).to.equal(undefined)
  })

  it('should return undefined if passed a valid claimId value', function () {
    var result = UrlPathValidator.validate(VALID_CLAIMID)
    return expect(result).to.equal(undefined)
  })
})
