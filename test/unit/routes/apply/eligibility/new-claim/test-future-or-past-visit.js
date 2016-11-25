const supertest = require('supertest')
const proxyquire = require('proxyquire')
const expect = require('chai').expect
const express = require('express')
const bodyParser = require('body-parser')
const mockViewEngine = require('../../../mock-view-engine')
var request

describe('routes/apply/eligibility/new-claim/future-or-past-visit', function () {
  const REFERENCEID = 'FUTPAST-1234'
  const ROUTE = `/apply/first-time/eligibility/${REFERENCEID}/new-claim`
  const REPEAT_ROUTE = `/apply/repeat/eligibility/${REFERENCEID}/new-claim`

  var urlValidatorCalled = false

  beforeEach(function () {
    var app = express()
    app.use(bodyParser.urlencoded({ extended: false }))
    mockViewEngine(app, '../../../app/views')
    var route = proxyquire('../../../../../../app/routes/apply/eligibility/new-claim/future-or-past-visit', {
      '../../../../services/validators/url-path-validator': function () { urlValidatorCalled = true }
    })
    route(app)
    request = supertest(app)
    urlValidatorCalled = false
  })

  describe(`GET ${ROUTE}`, function () {
    it('should respond with a 200', function (done) {
      request
        .get(ROUTE)
        .expect(200)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(urlValidatorCalled).to.be.true
          done()
        })
    })
  })

  describe(`POST ${ROUTE}`, function () {
    it('should redirect to /apply/first-time/eligibility/:reference/new-claim/past for first-time claim', function (done) {
      request
        .post(ROUTE)
        .expect(302)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(response.header.location).to.equal(`${ROUTE}/past`)
          done()
        })
    })

    it('should redirect to /apply/first-time/eligibility/:reference/new-claim/same-journey-as-last-claim for repeat claim', function (done) {
      request
        .post(REPEAT_ROUTE)
        .expect(302)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(response.header.location).to.equal(`${REPEAT_ROUTE}/same-journey-as-last-claim`)
          done()
        })
    })
  })
})
