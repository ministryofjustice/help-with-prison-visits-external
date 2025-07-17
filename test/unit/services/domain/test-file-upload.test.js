/* eslint-disable no-new */
const UploadError = require('../../../../app/services/errors/upload-error')

describe('services/domain/file-upload', () => {
  const VALID_ID = '1'
  const VALID_DOCUMENT_TYPE = 'VISIT_CONFIRMATION'
  const VALID_FILE = { path: 'path' }
  const VALID_DOCUMENT_STATUS = 'uploaded'
  const ERROR = new Error('some error message')
  const UPLOAD_ERROR = new UploadError('File type error')
  const VALID_ALTERNATIVE = 'some alternative'

  let MockFileUploadClass
  const mockFs = jest.fn()

  beforeEach(() => {
    jest.mock('fs', () => mockFs)

    MockFileUploadClass = require('../../../../app/services/domain/file-upload')
  })

  it('should construct a domain object given valid input when documentStatus is set to uploaded', () => {
    const mockFileUpload = new MockFileUploadClass(
      VALID_ID,
      VALID_DOCUMENT_TYPE,
      VALID_ID,
      VALID_FILE,
      undefined,
      undefined,
    )

    expect(mockFileUpload.path).toBe(VALID_FILE.path)
    expect(mockFileUpload.claimId).toBe(VALID_ID)
    expect(mockFileUpload.documentStatus).toBe(VALID_DOCUMENT_STATUS)
  })

  it('should construct a domain object given valid input when documentStatus is set to alternative and change undefined claimExpeneseId to null', () => {
    const mockFileUpload = new MockFileUploadClass(
      VALID_ID,
      VALID_DOCUMENT_TYPE,
      undefined,
      undefined,
      undefined,
      VALID_ALTERNATIVE,
    )

    expect(mockFileUpload.path).toBeUndefined()
    expect(mockFileUpload.claimId).toBe(VALID_ID)
    expect(mockFileUpload.claimExpenseId).toBeNull()
    expect(mockFileUpload.documentStatus).toBe(VALID_ALTERNATIVE)
  })

  it('should throw a ValidationError if passed invalid data', () => {
    expect(() => {
      new MockFileUploadClass(VALID_ID, VALID_DOCUMENT_TYPE, VALID_ID, undefined, undefined, undefined)
    }).toThrow()
  })

  it('should throw a ValidationError if passed an instance of UploadError', () => {
    expect(() => {
      new MockFileUploadClass(VALID_ID, VALID_DOCUMENT_TYPE, VALID_ID, VALID_FILE, UPLOAD_ERROR, undefined)
    }).toThrow()
  })

  it('should throw the given error if passed any type of error other than ValidationError', () => {
    expect(() => {
      new MockFileUploadClass(VALID_ID, VALID_DOCUMENT_TYPE, VALID_ID, VALID_FILE, ERROR, undefined)
    }).toThrow(ERROR)
  })

  it('should throw a ValidationError if both file and alternative are set. I.e. A user selects post later and uploads a file', () => {
    mockFs.unlinkSync = () => {}
    expect(() => {
      new MockFileUploadClass(VALID_ID, VALID_DOCUMENT_TYPE, VALID_ID, VALID_FILE, undefined, VALID_ALTERNATIVE)
    }).toThrow()
  })
})
