const routeHelper = require('../../../helpers/routes/route-helper')
const supertest = require('supertest')
const expect = require('chai').expect
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')
const ValidationError = require('../../../../app/services/errors/validation-error')

var urlPathValidatorStub
var stubInsertVisitor
var stubAboutYou
var app

describe('routes/first-time/about-you', function () {
  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    stubInsertVisitor = sinon.stub()
    stubAboutYou = sinon.stub()
    var route = proxyquire('../../../../app/routes/first-time/about-you', {
      '../../services/data/insert-visitor': stubInsertVisitor,
      '../../services/domain/about-you': stubAboutYou,
      '../../services/validators/url-path-validator': urlPathValidatorStub
    })

    app = routeHelper.buildApp(route)
  })

  describe('GET /first-time/:dob/:relationship/:benefit/:reference', function () {
    it('should respond with a 200 for valid path parameters', function () {
      return supertest(app)
        .get('/first-time/1980-01-01/partner/income-support/1234567')
        .expect(200)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })
  })

  describe('POST /first-time/:dob/:relationship/:benefit/:reference', function () {
    it('should persist data and redirect to /application-submitted/:reference for valid data', function () {
      var reference = '1234567'
      var aboutYou = {}
      stubInsertVisitor.resolves()
      stubAboutYou.returns(aboutYou)

      return supertest(app)
        .post(`/first-time/1980-01-01/partner/income-support/${reference}`)
        .expect(302)
        .expect(function (response) {
          sinon.assert.calledOnce(urlPathValidatorStub)
          expect(stubAboutYou.calledOnce).to.be.true
          expect(stubInsertVisitor.calledOnce).to.be.true
          expect(response.header.location).to.equal(`/first-time-claim/eligibility/${reference}/new-claim`)
        })
    })

    it('should respond with a 400 for invalid data', function () {
      var reference = '1234567'
      stubAboutYou.throws(new ValidationError({ 'firstName': {} }))
      return supertest(app)
        .post(`/first-time/1980-01-01/partner/income-support/${reference}`)
        .expect(400)
        .expect(function () {
          expect(stubAboutYou.calledOnce).to.be.true
        })
    })
  })
})
