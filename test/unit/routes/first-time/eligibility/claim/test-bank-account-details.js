var supertest = require('supertest')
var proxyquire = require('proxyquire')
var express = require('express')
const expect = require('chai').expect
var mockViewEngine = require('../../../mock-view-engine')
var bodyParser = require('body-parser')
const sinon = require('sinon')
require('sinon-bluebird')
var bankAccountDetails = require('../../../../../../app/services/data/bank-account-details')
var reference = 'V123456'
var claimId = '1'
var ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/first-time/eligibility/claim/bank-account-details', function () {
  var request
  var stubBankAccountDetails
  const VALID_DATA = {
    'AccountNumber': '12345678',
    'SortCode': '123456'
  }

  beforeEach(function () {
    stubBankAccountDetails = sinon.stub()

    var route = proxyquire(
      '../../../../../../app/routes/first-time/eligibility/claim/bank-account-details', {
        '../../../../services/domain/bank-account-details': stubBankAccountDetails,
        '../../../../services/data/bank-account-details': bankAccountDetails
      })

    var app = express()
    app.use(bodyParser.json())
    mockViewEngine(app, '../../../app/views')
    route(app)
    request = supertest(app)
  })

  describe('GET /first-time-claim/eligibility/:reference/claim/:claimId/bank-account-details', function () {
    it('should respond with a 200', function (done) {
      request
        .get(`/first-time-claim/eligibility/${reference}/claim/${claimId}/bank-account-details`)
        .expect(200)
        .end(done)
    })
  })

  describe('POST /first-time-claim/eligibility/:reference/claim/:claimId/bank-account-details', function () {
    it('should respond with a 302', function (done) {
      var newBankAccountDetails = {}
      stubBankAccountDetails.returns(newBankAccountDetails)
      var mockInsert = sinon.mock(bankAccountDetails)
      mockInsert.expects('insert').withExactArgs(claimId, newBankAccountDetails).resolves(1)

      request
        .post(`/first-time-claim/eligibility/${reference}/claim/${claimId}/bank-account-details`)
        .send(VALID_DATA)
        .expect(302)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(mockInsert.verify()).to.be.true
          expect(response.headers['location']).to.be.equal('/application-submitted/' + reference)
          done()
        })
    })

    it('should respond with a 400 if validation fails', function (done) {
      stubBankAccountDetails.throws(new ValidationError({ 'firstName': {} }))
      request
        .post(`/first-time-claim/eligibility/${reference}/claim/${claimId}/bank-account-details`)
        .expect(400)
        .end(done)
    })
  })
})
