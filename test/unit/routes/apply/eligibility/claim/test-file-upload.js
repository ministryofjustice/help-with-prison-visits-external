const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/apply/eligibility/claim/file-upload', function () {
  const COOKIES = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA3NDEwLjgzMzM2NjY2NiwiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyIsInJlbGF0aW9uc2hpcCI6InI0IiwiYmVuZWZpdCI6ImIxIiwicmVmZXJlbmNlSWQiOiI1ZTI2NzIxOGFhY2UzMGE3MDciLCJkZWNyeXB0ZWRSZWYiOiJUUDVWVjg5IiwiY2xhaW1UeXBlIjoiZmlyc3QtdGltZSIsImFkdmFuY2VPclBhc3QiOiJwYXN0IiwiY2xhaW1JZCI6MTF9']
  const COOKIES_EXPIRED = ['apvs-start-application=']
  const ROUTE = '/apply/eligibility/claim/summary/file-upload?document='

  let app
  const mockUrlPathValidator = jest.fn()
  const mockUpload = jest.fn()
  const mockFileUpload = jest.fn()
  const mockClaimDocumentInsert = jest.fn()
  const mockGenerateCSRFToken = jest.fn()
  const mockClamAv = jest.fn()
  const mockConfig = jest.fn()
  const mockInsertTask = jest.fn()
  const mockDisableOldClaimDocuments = jest.fn()
  const mockCheckExpenseIsEnabled = jest.fn()
  const mockCsurf = jest.fn()
  const mockCsurfResponse = jest.fn()

  beforeEach(function () {
    mockDisableOldClaimDocuments.mockResolvedValue()
    mockCheckExpenseIsEnabled.mockResolvedValue()
    mockCsurf.mockReturnValue(mockCsurfResponse)

    jest.mock(
      '../../../../../../app/services/validators/url-path-validator',
      () => mockUrlPathValidator
    )
    jest.mock('../../../../../../app/services/upload', () => mockUpload)
    jest.mock('../../../../../../app/services/domain/file-upload', () => mockFileUpload)
    jest.mock(
      '../../../../../../app/services/data/insert-file-upload-details-for-claim',
      () => mockClaimDocumentInsert
    )
    jest.mock('../../../../../../app/services/generate-csrf-token', () => mockGenerateCSRFToken)
    jest.mock('../../../../../../app/services/clam-av', () => ({
      mockClamAv,
      '@noCallThru': true
    }))
    jest.mock('../../../../../../config', () => mockConfig)
    jest.mock('../../../../../../app/services/data/insert-task', () => mockInsertTask)
    jest.mock(
      '../../../../../../app/services/data/disable-old-claim-documents',
      () => mockDisableOldClaimDocuments
    )
    jest.mock(
      '../../../../../../app/services/data/check-expense-is-enabled',
      () => mockCheckExpenseIsEnabled
    )
    jest.mock('csurf', () => mockCsurf)

    const route = require('../../../../../../app/routes/apply/eligibility/claim/file-upload')
    app = routeHelper.buildApp(route)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe(`GET ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
        })
    })

    it('should call the CSRFToken generator', function () {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(mockGenerateCSRFToken).toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 200 if passed valid document type', function () {
      return supertest(app)
        .get(`${ROUTE}VISIT_CONFIRMATION`)
        .set('Cookie', COOKIES)
        .expect(200)
    })

    it('should respond with a 500 if passed invalid document type', function () {
      return supertest(app)
        .get(`${ROUTE}TEST`)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })

  describe(`POST ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      mockClamAv.mockResolvedValue()
      mockUpload.mockImplementation((...args) => args[2]())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
        })
    })

    it('should create a file upload object, insert it to DB and give 302', function () {
      mockUpload.mockImplementation((...args) => args[2]())
      mockClaimDocumentInsert.mockResolvedValue()
      mockClamAv.mockResolvedValue()
      return supertest(app)
        .post(`${ROUTE}VISIT_CONFIRMATION`)
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(mockUpload).toHaveBeenCalledTimes(1)
          expect(mockFileUpload).toHaveBeenCalledTimes(1)
          expect(mockClaimDocumentInsert).toHaveBeenCalledTimes(1)
        })
        .expect(302)
    })

    it('should redirect to date-of-birth error page if cookie is expired', function () {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', '/start-already-registered?error=expired')
    })

    it('should catch a validation error', function () {
      mockUpload.mockImplementation((...args) => args[2]())
      mockFileUpload.mockImplementation(() => { throw new ValidationError() })
      mockClamAv.mockResolvedValue()
      return supertest(app)
        .post(`${ROUTE}VISIT_CONFIRMATION`)
        .set('Cookie', COOKIES)
        .expect(400)
    })

    it('should respond with a 500 if passed invalid document type', function () {
      mockUpload.mockImplementation((...args) => args[2]())
      return supertest(app)
        .post(`${ROUTE}TEST`)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })
})
