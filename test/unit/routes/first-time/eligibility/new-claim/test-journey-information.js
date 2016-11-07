const supertest = require('supertest')
const proxyquire = require('proxyquire')
const express = require('express')
const expect = require('chai').expect
const bodyParser = require('body-parser')
const mockViewEngine = require('../../../mock-view-engine')
const sinon = require('sinon')
require('sinon-bluebird')
var ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/first-time/eligibility/new-claim/journey-information', function () {
  var request
  var urlValidatorCalled = false
  var reference = 'APVS123'
  var claimId = '123'
  var day = 26
  var month = 10
  var year = 2016

  var VALID_DATA = {
    'date-of-journey-day': day,
    'date-of-journey-month': month,
    'date-of-journey-year': year
  }

  var stubClaim
  var stubInsertClaim

  beforeEach(function () {
    stubClaim = sinon.stub()
    stubInsertClaim = sinon.stub()
    var app = express()
    app.use(bodyParser.json())
    mockViewEngine(app, '../../../app/views')
    var route = proxyquire('../../../../../../app/routes/first-time/eligibility/new-claim/journey-information', {
      '../../../../services/validators/url-path-validator': function () { urlValidatorCalled = true },
      '../../../../services/domain/first-time-claim': stubClaim,
      '../../../../services/data/insert-first-time-claim': stubInsertClaim
    })
    route(app)
    request = supertest(app)
    urlValidatorCalled = false
  })

  describe('GET /first-time/eligibility/:reference/new-claim/past', function () {
    it('should respond with a 200', function (done) {
      request
        .get(`/first-time/eligibility/${reference}/new-claim/past`)
        .expect(200)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(urlValidatorCalled).to.be.true
          done()
        })
    })
  })

  describe('POST /first-time/eligibility/:reference/new-claim/past', function () {
    it('should redirect to /first-time-claim/eligibility/:reference/claim/:claimId', function (done) {
      var newClaim = {}
      stubClaim.returns(newClaim)
      stubInsertClaim.resolves(claimId)
      request
        .post(`/first-time/eligibility/${reference}/new-claim/past`)
        .send(VALID_DATA)
        .expect(302)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(urlValidatorCalled).to.be.true
          expect(stubClaim.calledWith(reference, day, month, year)).to.be.true
          expect(stubInsertClaim.calledWithExactly(newClaim)).to.be.true
          expect(response.header.location).to.equal(`/first-time/eligibility/${reference}/claim/${claimId}`)
          done()
        })
    })

    it('should response with a 400 for invalid data', function (done) {
      stubClaim.throws(new ValidationError({ 'Reference': [] }))
      request
        .post(`/first-time/eligibility/${reference}/new-claim/past`)
        .expect(400)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(urlValidatorCalled).to.be.true
          done()
        })
    })
  })
})
