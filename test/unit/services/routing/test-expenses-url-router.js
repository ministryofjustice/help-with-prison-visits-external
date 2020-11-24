const expect = require('chai').expect
const sinon = require('sinon')
const expensesUrlRouter = require('../../../../app/services/routing/expenses-url-router')
const paramBuilder = require('../../../../app/services/routing/param-builder')

describe('services/routing/expenses-url-router', function () {
  describe('parseParams', function () {
    let buildFormatted

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
  })
})
