var supertest = require('supertest')
var proxyquire = require('proxyquire')
var express = require('express')
const expect = require('chai').expect
var mockViewEngine = require('../../../mock-view-engine')
var bodyParser = require('body-parser')
var reference = 'V123456'
var claimId = '1'

describe('routes/first-time/eligibility/claim/claim-summary', function () {
  var request
  var urlValidatorCalled

  beforeEach(function () {
    var route = proxyquire(
      '../../../../../../app/routes/first-time/eligibility/claim/claim-summary', {
        '../../../../services/validators/url-path-validator': function () { urlValidatorCalled = true }
      })

    var app = express()
    app.use(bodyParser.json())
    mockViewEngine(app, '../../../app/views')
    route(app)
    request = supertest(app)
    urlValidatorCalled = false
  })

  describe('GET /first-time-claim/eligibility/:reference/claim/:claimId/summary', function () {
    it('should respond with a 200', function (done) {
      request
        .get(`/first-time-claim/eligibility/${reference}/claim/${claimId}/summary`)
        .expect(200)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(urlValidatorCalled).to.be.true
          done()
        })
    })
  })

  describe('POST /first-time-claim/eligibility/:reference/claim/:claimId/summary', function () {
    it('should respond with a 302', function (done) {
      request
        .post(`/first-time-claim/eligibility/${reference}/claim/${claimId}/summary`)
        .expect(302)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(urlValidatorCalled).to.be.true
          expect(response.headers['location']).to.be.equal(`/first-time-claim/eligibility/${reference}/claim/${claimId}/bank-account-details`)
          done()
        })
    })
  })
})
