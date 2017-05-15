const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const ValidationError = require('../../../../../../app/services/errors/validation-error')
require('sinon-bluebird')

describe('routes/apply/eligibility/claim/file-upload', function () {
  const COOKIES = [ 'apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA3NDEwLjgzMzM2NjY2NiwiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyIsInJlbGF0aW9uc2hpcCI6InI0IiwiYmVuZWZpdCI6ImIxIiwicmVmZXJlbmNlSWQiOiI1ZTI2NzIxOGFhY2UzMGE3MDciLCJkZWNyeXB0ZWRSZWYiOiJUUDVWVjg5IiwiY2xhaW1UeXBlIjoiZmlyc3QtdGltZSIsImFkdmFuY2VPclBhc3QiOiJwYXN0IiwiY2xhaW1JZCI6MTF9' ]
  const COOKIES_EXPIRED = [ 'apvs-start-application=' ]
  const ROUTE = `/apply/eligibility/claim/summary/file-upload?document=`

  var app
  var urlPathValidatorStub
  var directoryCheckStub
  var uploadStub
  var fileUploadStub
  var claimDocumentInsertStub
  var generateCSRFTokenStub
  var clamAvStub
  var configStub
  var insertTaskStub
  var disableOldClaimDocumentsStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    directoryCheckStub = sinon.stub()
    uploadStub = sinon.stub()
    fileUploadStub = sinon.stub()
    claimDocumentInsertStub = sinon.stub()
    generateCSRFTokenStub = sinon.stub()
    clamAvStub = sinon.stub()
    configStub = sinon.stub()
    insertTaskStub = sinon.stub()
    disableOldClaimDocumentsStub = sinon.stub().resolves()

    var route = proxyquire('../../../../../../app/routes/apply/eligibility/claim/file-upload', {
      '../../../../services/validators/url-path-validator': urlPathValidatorStub,
      '../../../../services/directory-check': directoryCheckStub,
      '../../../../services/upload': uploadStub,
      '../../../../services/domain/file-upload': fileUploadStub,
      '../../../../services/data/insert-file-upload-details-for-claim': claimDocumentInsertStub,
      '../../../../services/generate-csrf-token': generateCSRFTokenStub,
      '../../../../services/clam-av': { clamAvStub, '@noCallThru': true },
      '../../../../../config': configStub,
      '../../../../services/data/insert-task': insertTaskStub,
      '../../../../services/data/disable-old-claim-documents': disableOldClaimDocumentsStub,
      'csurf': function () { return function () { } }
    })
    app = routeHelper.buildApp(route)
  })

  describe(`GET ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should call the CSRFToken generator', function () {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.assert.calledOnce(generateCSRFTokenStub)
        })
    })

    it('should respond with a 200 if passed valid document type', function () {
      return supertest(app)
        .get(`${ROUTE}VISIT_CONFIRMATION`)
        .set('Cookie', COOKIES)
        .expect(200)
    })

    it('should call the directory check', function () {
      return supertest(app)
        .get(`${ROUTE}VISIT_CONFIRMATION`)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.assert.calledOnce(directoryCheckStub)
        })
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
      clamAvStub.resolves()
      uploadStub.callsArg(2)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should create a file upload object, insert it to DB and give 302', function () {
      uploadStub.callsArg(2).returns({})
      claimDocumentInsertStub.resolves()
      clamAvStub.resolves()
      return supertest(app)
        .post(`${ROUTE}VISIT_CONFIRMATION`)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.assert.calledOnce(uploadStub)
          sinon.assert.calledOnce(fileUploadStub)
          sinon.assert.calledOnce(claimDocumentInsertStub)
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
      uploadStub.callsArg(2).returns({})
      fileUploadStub.throws(new ValidationError())
      clamAvStub.resolves()
      return supertest(app)
        .post(`${ROUTE}VISIT_CONFIRMATION`)
        .set('Cookie', COOKIES)
        .expect(400)
    })

    it('should respond with a 500 if passed invalid document type', function () {
      uploadStub.callsArg(2).returns({})
      return supertest(app)
        .post(`${ROUTE}TEST`)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })
})
