const expect = require('chai').expect
const sinon = require('sinon')
const expensesUrlRouter = require('../../../../app/services/routing/expenses-url-router')
const paramBuilder = require('../../../../app/services/routing/param-builder')

describe('services/routing/expenses-url-router', function () {
  describe('parseParams', function () {
    var buildFormatted

    before(function () {
      buildFormatted = sinon.stub(paramBuilder, 'buildFormatted')
    })

    after(function () {
      buildFormatted.restore()
    })

    it('should call buildFormatted to build and format the params parameter', function () {
      expensesUrlRouter.parseParams([])
      sinon.assert.calledOnce(buildFormatted)
    })
  })

  describe('getRedirectUrl', function () {
    const VALID_PARAM_ONE = 'bus'
    const VALID_PARAM_TWO = 'hire'
    const CLAIM_TYPE = 'first-time'
    const REFERENCEID = 'URLROUT-123'
    const CLAIM_ID = '456'
    const ORIGINAL_URL = 'some-url'
    var validRequest = {
      body: {
        expenses: [
          VALID_PARAM_ONE,
          VALID_PARAM_TWO
        ]
      },
      originalUrl: ORIGINAL_URL,
      query: {},
      params: {
        claimType: CLAIM_TYPE,
        referenceId: REFERENCEID,
        claimId: CLAIM_ID
      }
    }
    const VALID_REQUEST_OUTPUT = `/apply/first-time/eligibility/${REFERENCEID}/claim/${CLAIM_ID}/${VALID_PARAM_ONE}?${VALID_PARAM_TWO}=`

    it('should throw an error if req is invalid', function (done) {
      expect(function () {
        expensesUrlRouter.getRedirectUrl(
          null)
      }).to.throw(Error)
      done()
    })

    it('should throw an error if req.body is invalid', function (done) {
      expect(function () {
        expensesUrlRouter.getRedirectUrl({
          body: null
        })
      }).to.throw(Error)
      done()
    })

    it('should throw an error if req.params is invalid', function (done) {
      expect(function () {
        expensesUrlRouter.getRedirectUrl({
          params: null
        })
      }).to.throw(Error)
      done()
    })

    it('should throw an error if req.params.referenceId is invalid', function (done) {
      expect(function () {
        expensesUrlRouter.getRedirectUrl({
          params: {
            referenceId: null
          }
        })
      }).to.throw(Error)
      done()
    })

    it('should throw an error if req.params.claimId is invalid', function (done) {
      expect(function () {
        expensesUrlRouter.getRedirectUrl({
          params: {
            claimId: null
          }
        })
      }).to.throw(Error)
      done()
    })

    it('should throw an error if req.originalUrl is invalid', function (done) {
      expect(function () {
        expensesUrlRouter.getRedirectUrl({
          originalUrl: null
        })
      }).to.throw(Error)
      done()
    })

    it('should throw an error if req.query is invalid', function (done) {
      expect(function () {
        expensesUrlRouter.getRedirectUrl({
          query: null
        })
      }).to.throw(Error)
      done()
    })

    it('should return a url path if passed a valid request and add-another-journey was not set', function (done) {
      var result = expensesUrlRouter.getRedirectUrl(validRequest)
      expect(result).to.be.equal(VALID_REQUEST_OUTPUT)
      done()
    })

    it('should return the originalUrl if passed a valid request with add-another-journey set', function (done) {
      validRequest.body['add-another-journey'] = 'on'
      var result = expensesUrlRouter.getRedirectUrl(validRequest)
      expect(result).to.be.equal(ORIGINAL_URL)
      done()
    })
  })
})
