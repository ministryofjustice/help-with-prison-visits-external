const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
// const bodyParser = require('body-parser')
// const ValidationError = require('../../../../../../app/services/errors/validation-error')
require('sinon-bluebird')

describe('routes/first-time/eligibility/claim/file-upload', function () {
  const ROUTE = `/first-time/eligibility/A123456/claim/1/file-upload?document=`

  var app
  var urlPathValidatorStub
  var directoryCheckStub
  var uploadStub
  var fileUploadStub
  var claimDocumentInsertStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    directoryCheckStub = sinon.stub()
    uploadStub = sinon.stub()
    fileUploadStub = sinon.stub()
    claimDocumentInsertStub = sinon.stub()

    var route = proxyquire('../../../../../../app/routes/first-time/eligibility/claim/file-upload', {
      '../../../../services/validators/url-path-validator': urlPathValidatorStub,
      '../../../../services/directory-check': directoryCheckStub,
      '../../../../services/upload': uploadStub,
      '../../../../services/domain/file-upload': fileUploadStub,
      '../../../../services/data/insert-file-upload-details-for-claim': claimDocumentInsertStub
    })
    app = routeHelper.buildApp(route)
  })

  describe(`GET ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .get(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should respond with a 200 if passed valid document type', function () {
      return supertest(app)
        .get(`${ROUTE}VISIT_CONFIRMATION`)
        .expect(200)
    })

    it('should call the directory check', function () {
      return supertest(app)
        .get(`${ROUTE}VISIT_CONFIRMATION`)
        .expect(function () {
          sinon.assert.calledOnce(directoryCheckStub)
        })
    })

    it('should respond with a 500 if passed invalid document type', function () {
      return supertest(app)
        .get(`${ROUTE}TEST`)
        .expect(500)
    })
  })

  describe(`POST ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      uploadStub.callsArg(2)
      return supertest(app)
        .post(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })
  })
})
