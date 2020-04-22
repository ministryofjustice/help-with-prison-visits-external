/* eslint-disable no-new */
const ValidationError = require('../../../../app/services/errors/validation-error')
const expect = require('chai').expect
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const UploadError = require('../../../../app/services/errors/upload-error')

describe('services/domain/file-upload', function () {
  const VALID_ID = '1'
  const VALID_DOCUMENT_TYPE = 'VISIT_CONFIRMATION'
  const VALID_FILE = { path: 'path' }
  const VALID_DOCUMENT_STATUS = 'uploaded'
  const ERROR = new Error('some error message')
  const UPLOAD_ERROR = new UploadError('File type error')
  const VALID_ALTERNATIVE = 'some alternative'

  var FileUpload
  var fsStub

  beforeEach(function () {
    fsStub = sinon.stub()

    FileUpload = proxyquire(
      '../../../../app/services/domain/file-upload', {
        fs: fsStub
      })
  })

  it('should construct a domain object given valid input when documentStatus is set to uploaded', function () {
    var fileUpload = new FileUpload(
      VALID_ID,
      VALID_DOCUMENT_TYPE,
      VALID_ID,
      VALID_FILE,
      undefined,
      undefined
    )

    expect(fileUpload.path).to.equal(VALID_FILE.path)
    expect(fileUpload.claimId).to.equal(VALID_ID)
    expect(fileUpload.documentStatus).to.equal(VALID_DOCUMENT_STATUS)
  })

  it('should construct a domain object given valid input when documentStatus is set to alternative and change undefined claimExpeneseId to null', function () {
    var fileUpload = new FileUpload(
      VALID_ID,
      VALID_DOCUMENT_TYPE,
      undefined,
      undefined,
      undefined,
      VALID_ALTERNATIVE
    )

    expect(fileUpload.path).to.equal(undefined)
    expect(fileUpload.claimId).to.equal(VALID_ID)
    expect(fileUpload.claimExpenseId).to.equal(null)
    expect(fileUpload.documentStatus).to.equal(VALID_ALTERNATIVE)
  })

  it('should throw a ValidationError if passed invalid data', function () {
    expect(function () {
      new FileUpload(
        VALID_ID,
        VALID_DOCUMENT_TYPE,
        VALID_ID,
        undefined,
        undefined,
        undefined
      )
    }).to.throw(ValidationError)
  })

  it('should throw a ValidationError if passed an instance of UploadError', function () {
    expect(function () {
      new FileUpload(
        VALID_ID,
        VALID_DOCUMENT_TYPE,
        VALID_ID,
        VALID_FILE,
        UPLOAD_ERROR,
        undefined
      )
    }).to.throw(ValidationError)
  })

  it('should throw the given error if passed any type of error other than ValidationError', function () {
    expect(function () {
      new FileUpload(
        VALID_ID,
        VALID_DOCUMENT_TYPE,
        VALID_ID,
        VALID_FILE,
        ERROR,
        undefined
      )
    }).to.throw(ERROR)
  })

  it('should throw a ValidationError if both file and alternative are set. I.e. A user selects post later and uploads a file', function () {
    fsStub.unlinkSync = function () {}
    expect(function () {
      new FileUpload(
        VALID_ID,
        VALID_DOCUMENT_TYPE,
        VALID_ID,
        VALID_FILE,
        undefined,
        VALID_ALTERNATIVE
      )
    }).to.throw(ValidationError)
  })
})
