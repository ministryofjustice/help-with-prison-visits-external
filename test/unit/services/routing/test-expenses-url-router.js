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
    const REFERENCE_ID = 'URLROUT-123'
    const CLAIM_ID = '456'
    const ORIGINAL_URL = 'some-url'
    const SUMMARY_URL = `/apply/first-time/eligibility/${REFERENCE_ID}/claim/${CLAIM_ID}/summary`

    var VALID_REQUEST = {
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
        referenceId: REFERENCE_ID,
        claimId: CLAIM_ID
      }
    }
    const VALID_REQUEST_OUTPUT = `/apply/first-time/eligibility/${REFERENCE_ID}/claim/${CLAIM_ID}/${VALID_PARAM_ONE}?${VALID_PARAM_TWO}=`

    const NO_EXPENSE_REQUEST = {
      body: {
        expenses: []
      },
      originalUrl: ORIGINAL_URL,
      query: {},
      params: {
        claimType: CLAIM_TYPE,
        referenceId: REFERENCE_ID,
        claimId: CLAIM_ID
      }
    }

    const QUERY_PARAMATER_EXPENSE_REQUEST = {
      body: {
        expenses: []
      },
      originalUrl: ORIGINAL_URL,
      query: {
        'bus': ''
      },
      params: {
        claimType: CLAIM_TYPE,
        referenceId: REFERENCE_ID,
        claimId: CLAIM_ID
      }
    }

    it('should throw an error if req is invalid', function () {
      expect(function () {
        expensesUrlRouter.getRedirectUrl(null)
      }).to.throw(Error)
    })

    it('should throw an error if req.body is invalid', function () {
      expect(function () {
        expensesUrlRouter.getRedirectUrl({
          body: null
        })
      }).to.throw(Error)
    })

    it('should throw an error if req.params is invalid', function () {
      expect(function () {
        expensesUrlRouter.getRedirectUrl({
          params: null
        })
      }).to.throw(Error)
    })

    it('should throw an error if req.params.referenceId is invalid', function () {
      expect(function () {
        expensesUrlRouter.getRedirectUrl({
          params: {
            referenceId: null
          }
        })
      }).to.throw(Error)
    })

    it('should throw an error if req.params.claimId is invalid', function () {
      expect(function () {
        expensesUrlRouter.getRedirectUrl({
          params: {
            claimId: null
          }
        })
      }).to.throw(Error)
    })

    it('should throw an error if req.originalUrl is invalid', function () {
      expect(function () {
        expensesUrlRouter.getRedirectUrl({
          originalUrl: null
        })
      }).to.throw(Error)
    })

    it('should throw an error if req.query is invalid', function () {
      expect(function () {
        expensesUrlRouter.getRedirectUrl({
          query: null
        })
      }).to.throw(Error)
    })

    it('should return a url path to the summary page if no expenses are set', function () {
      var result = expensesUrlRouter.getRedirectUrl(NO_EXPENSE_REQUEST)
      expect(result).to.be.equal(SUMMARY_URL)
    })

    it('should return a url path built from the query parameters if they are set', function () {
      var result = expensesUrlRouter.getRedirectUrl(QUERY_PARAMATER_EXPENSE_REQUEST)
      expect(result).to.be.equal(`/apply/first-time/eligibility/${REFERENCE_ID}/claim/${CLAIM_ID}/bus`)
    })

    it('should return a url path if passed a valid request and add-another-journey was not set', function () {
      var result = expensesUrlRouter.getRedirectUrl(VALID_REQUEST)
      expect(result).to.be.equal(VALID_REQUEST_OUTPUT)
    })

    it('should return the originalUrl if passed a valid request with add-another-journey set', function () {
      VALID_REQUEST.body['add-another-journey'] = 'on'
      var result = expensesUrlRouter.getRedirectUrl(VALID_REQUEST)
      expect(result).to.be.equal(ORIGINAL_URL)
    })
  })
})
