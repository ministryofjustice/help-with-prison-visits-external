/* eslint-disable no-new */
const sinon = require('sinon')
const UploadError = require('../../../../app/services/errors/upload-error')

jest.mock(fs, () => fsStub)

describe('services/domain/file-upload', function () {
  const VALID_ID = '1'
  const VALID_DOCUMENT_TYPE = 'VISIT_CONFIRMATION'
  const VALID_FILE = { path: 'path' }
  const VALID_DOCUMENT_STATUS = 'uploaded'
  const ERROR = new Error('some error message')
  const UPLOAD_ERROR = new UploadError('File type error')
  const VALID_ALTERNATIVE = 'some alternative'

  let FileUpload
  let fsStub

  beforeEach(function () {
    fsStub = sinon.stub()

    FileUpload = require('../../../../app/services/domain/file-upload')
  })

  it('should construct a domain object given valid input when documentStatus is set to uploaded', function () {
    const fileUpload = new FileUpload(
      VALID_ID,
      VALID_DOCUMENT_TYPE,
      VALID_ID,
      VALID_FILE,
      undefined,
      undefined
    )

    expect(fileUpload.path).toBe(VALID_FILE.path)
    expect(fileUpload.claimId).toBe(VALID_ID)
    expect(fileUpload.documentStatus).toBe(VALID_DOCUMENT_STATUS)
  })

  it('should construct a domain object given valid input when documentStatus is set to alternative and change undefined claimExpeneseId to null', function () {
    const fileUpload = new FileUpload(
      VALID_ID,
      VALID_DOCUMENT_TYPE,
      undefined,
      undefined,
      undefined,
      VALID_ALTERNATIVE
    )

    expect(fileUpload.path).toBeUndefined()
    expect(fileUpload.claimId).toBe(VALID_ID)
    expect(fileUpload.claimExpenseId).toBeNull()
    expect(fileUpload.documentStatus).toBe(VALID_ALTERNATIVE)
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
    }).toThrow()
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
    }).toThrow()
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
    }).toThrow(ERROR)
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
    }).toThrow()
  })
})
