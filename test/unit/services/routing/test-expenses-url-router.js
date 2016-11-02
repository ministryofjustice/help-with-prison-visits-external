const expect = require('chai').expect
const sinon = require('sinon')
const expensesUrlRouter = require('../../../../app/services/routing/expenses-url-router')
const paramBuilder = require('../../../../app/services/routing/param-builder')

describe('services/routing/expenses-url-router', function () {
  var sandbox
  beforeEach(function () {
    sandbox = sinon.sandbox.create()
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('parseParams', function () {
    it('should call buildFormatted to build and format the params parameter', function () {
      var buildFormatted = sandbox.stub(paramBuilder, 'buildFormatted')
      expensesUrlRouter.parseParams([])
      sinon.assert.calledOnce(buildFormatted)
    })
  })

  describe('getRedirectUrl', function () {
    const VALID_PARAM_ONE = 'bus'
    const VALID_PARAM_TWO = 'hire'
    const REFERENCE = '123'
    const CLAIM_ID = '456'
    const ORIGINAL_URL = 'some url'
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
        reference: REFERENCE,
        claimId: CLAIM_ID
      }
    }
    const VALID_REQUEST_OUTPUT = `/first-time-claim/eligibility/${REFERENCE}/claim/${CLAIM_ID}/${VALID_PARAM_ONE}?${VALID_PARAM_TWO}=`

    it('should throw an error if req is invalid', function () {
      return expect(function () {
        expensesUrlRouter.getRedirectUrl(
          null)
      }).to.throw(Error)
    })

    it('should throw an error if req.body is invalid', function () {
      return expect(function () {
        expensesUrlRouter.getRedirectUrl({
          body: null
        })
      }).to.throw(Error)
    })

    it('should throw an error if req.params is invalid', function () {
      return expect(function () {
        expensesUrlRouter.getRedirectUrl({
          params: null
        })
      }).to.throw(Error)
    })

    it('should throw an error if req.params.reference is invalid', function () {
      return expect(function () {
        expensesUrlRouter.getRedirectUrl({
          params: {
            reference: null
          }
        })
      }).to.throw(Error)
    })

    it('should throw an error if req.params.claimId is invalid', function () {
      return expect(function () {
        expensesUrlRouter.getRedirectUrl({
          params: {
            claimId: null
          }
        })
      }).to.throw(Error)
    })

    it('should throw an error if req.originalUrl is invalid', function () {
      return expect(function () {
        expensesUrlRouter.getRedirectUrl({
          originalUrl: null
        })
      }).to.throw(Error)
    })

    it('should throw an error if req.query is invalid', function () {
      return expect(function () {
        expensesUrlRouter.getRedirectUrl({
          query: null
        })
      }).to.throw(Error)
    })

    it('should return a url path if passed a valid request and add-another-journey was not set', function () {
      var result = expensesUrlRouter.getRedirectUrl(validRequest)
      return expect(result).to.be.equal(VALID_REQUEST_OUTPUT)
    })

    it('should return the originalUrl if passed a valid request with add-another-journey set', function () {
      validRequest.body['add-another-journey'] = 'on'
      var result = expensesUrlRouter.getRedirectUrl(validRequest)
      return expect(result).to.be.equal(ORIGINAL_URL)
    })
  })
})
