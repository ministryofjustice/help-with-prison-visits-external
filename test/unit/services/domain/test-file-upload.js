const FileUpload = require('../../../../app/services/domain/file-upload')
const ValidationError = require('../../../../app/services/errors/validation-error')
const expect = require('chai').expect
const documentTypeEnum = require('../../../../app/constants/document-type-enum')

describe('services/domain/file-upload', function () {
  const VALID_ID = '1'
  const VALID_DOCUMENT_TYPE = documentTypeEnum.VISIT_CONFIRMATION
  const VALID_FILE = {path: 'path'}
  const VALID_DOCUMENT_STATUS = 'uploaded'
  const FILETYPE_ERROR = 'error'
  // const VALID_ALTERNATIVE_WHEN_NO_FILE = undefined

  it('should construct a domain object given valid input', function () {
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

  it('should throw an error if passed invalid data', function () {
    expect(function () {
      new FileUpload(
        VALID_ID,
        VALID_DOCUMENT_TYPE,
        VALID_ID,
        undefined,
        undefined,
        undefined
      ).isValid()
    }).to.throw(ValidationError)
  })

  it('should throw an error if passed file type error', function () {
    expect(function () {
      new FileUpload(
        VALID_ID,
        VALID_DOCUMENT_TYPE,
        VALID_ID,
        VALID_FILE,
        FILETYPE_ERROR,
        undefined
      ).isValid()
    }).to.throw(ValidationError)
  })
})
