const expect = require('chai').expect
const UrlPathValidator = require('../../../../app/services/validators/url-path-validator')
const prisonerRelationshipEnum = require('../../../../app/constants/prisoner-relationships-enum')
const benefitsEnum = require('../../../../app/constants/benefits-enum')

describe('services/validators/url-path-validator', function () {
  const VALID_DOB = { dob: '1989-04-11' }
  const INVALID_DOB = { dob: 'invalid' }

  const VALID_RELATIONSHIP = { relationship: prisonerRelationshipEnum.PARTNER.value }
  const INVALID_RELATIONSHIP = { relationship: 'invalid' }

  const VALID_BENEFIT = { benefit: benefitsEnum.INCOME_SUPPORT.value }
  const INVALID_BENEFIT = { benefit: 'invalid' }

  const VALID_REFERENCE = { reference: '49CCADM' }
  const INVALID_REFERENCE = { reference: 'invalid' }

  const VALID_CLAIMID = { claimId: '123' }
  const INVALID_CLAIMID = { claimId: 'invalid' }

  const VALID_REFERENCEID = { referenceId: '49CCADM-4321' }
  const INVALID_REFERENCEID = { referenceId: '49CCADM1XXX' }

  const VALID_CLAIM_DOCUMENT_ID = { claimId: '123' }
  const INVALID_CLAIM_DOCUMENT_ID = { claimId: 'invalid' }

  it('should throw error if passed null', function (done) {
    expect(function () {
      UrlPathValidator(null)
    }).to.throw(TypeError)
    done()
  })

  it('should throw error if passed undefined', function (done) {
    expect(function () {
      UrlPathValidator(undefined)
    }).to.throw(TypeError)
    done()
  })

  it('should throw Error if passed an invalid dob value', function (done) {
    expect(function () {
      UrlPathValidator(INVALID_DOB)
    }).to.throw(Error)
    done()
  })

  it('should throw Error if passed an invalid relationship value', function (done) {
    expect(function () {
      UrlPathValidator(INVALID_RELATIONSHIP)
    }).to.throw(Error)
    done()
  })

  it('should throw Error if passed an invalid benefit value', function (done) {
    expect(function () {
      UrlPathValidator(INVALID_BENEFIT)
    }).to.throw(Error)
    done()
  })

  it('should throw Error if passed an invalid reference value', function (done) {
    expect(function () {
      UrlPathValidator(INVALID_REFERENCE)
    }).to.throw(Error)
    done()
  })

  it('should throw Error if passed an invalid claimId value', function (done) {
    expect(function () {
      UrlPathValidator(INVALID_CLAIMID)
    }).to.throw(Error)
    done()
  })

  it('should throw Error if passed an invalid referenceId value', function (done) {
    expect(function () {
      UrlPathValidator(INVALID_REFERENCEID)
    }).to.throw(Error)
    done()
  })

  it('should throw Error if passed an invalid claimDocumentId value', function (done) {
    expect(function () {
      UrlPathValidator(INVALID_CLAIM_DOCUMENT_ID)
    }).to.throw(Error)
    done()
  })

  it('should return undefined if passed a valid dob value', function (done) {
    var result = UrlPathValidator(VALID_DOB)
    expect(result).to.equal(undefined)
    done()
  })

  it('should return undefined if passed a valid relationship value', function (done) {
    var result = UrlPathValidator(VALID_RELATIONSHIP)
    expect(result).to.equal(undefined)
    done()
  })

  it('should return undefined if passed a valid dob value', function (done) {
    var result = UrlPathValidator(VALID_DOB)
    expect(result).to.equal(undefined)
    done()
  })

  it('should return undefined if passed a valid benefit value', function (done) {
    var result = UrlPathValidator(VALID_BENEFIT)
    expect(result).to.equal(undefined)
    done()
  })

  it('should return undefined if passed a valid reference value', function (done) {
    var result = UrlPathValidator(VALID_REFERENCE)
    expect(result).to.equal(undefined)
    done()
  })

  it('should return undefined if passed a valid claimId value', function (done) {
    var result = UrlPathValidator(VALID_CLAIMID)
    expect(result).to.equal(undefined)
    done()
  })

  it('should return undefined if passed a valid referenceId value', function (done) {
    var result = UrlPathValidator(VALID_REFERENCEID)
    expect(result).to.equal(undefined)
    done()
  })

  it('should return undefined if passed a valid claimDocumentId value', function (done) {
    var result = UrlPathValidator(VALID_CLAIM_DOCUMENT_ID)
    expect(result).to.equal(undefined)
    done()
  })
})
