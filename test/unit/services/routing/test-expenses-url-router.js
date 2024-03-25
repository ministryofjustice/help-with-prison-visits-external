const sinon = require('sinon')
const expensesUrlRouter = require('../../../../app/services/routing/expenses-url-router')
const paramBuilder = require('../../../../app/services/routing/param-builder')

describe('services/routing/expenses-url-router', function () {
  describe('parseParams', function () {
    let buildFormatted

    beforeAll(function () {
      buildFormatted = sinon.stub(paramBuilder, 'buildFormatted')
    })

    afterAll(function () {
      buildFormatted.restore()
    })

    it('should call buildFormatted to build and format the params parameter', function () {
      expensesUrlRouter.parseParams([])
      sinon.toHaveBeenCalledTimes(1)
    })
  })

  describe('getRedirectUrl', function () {
    it('should throw an error if req is invalid', function () {
      expect(function () {
        expensesUrlRouter.getRedirectUrl(null)
      }).toThrow(Error)
    })

    it('should throw an error if req.body is invalid', function () {
      expect(function () {
        expensesUrlRouter.getRedirectUrl({
          body: null
        })
      }).toThrow(Error)
    })

    it('should throw an error if req.params is invalid', function () {
      expect(function () {
        expensesUrlRouter.getRedirectUrl({
          params: null
        })
      }).toThrow(Error)
    })

    it('should throw an error if req.params.referenceId is invalid', function () {
      expect(function () {
        expensesUrlRouter.getRedirectUrl({
          params: {
            referenceId: null
          }
        })
      }).toThrow(Error)
    })

    it('should throw an error if req.params.claimId is invalid', function () {
      expect(function () {
        expensesUrlRouter.getRedirectUrl({
          params: {
            claimId: null
          }
        })
      }).toThrow(Error)
    })

    it('should throw an error if req.originalUrl is invalid', function () {
      expect(function () {
        expensesUrlRouter.getRedirectUrl({
          originalUrl: null
        })
      }).toThrow(Error)
    })

    it('should throw an error if req.query is invalid', function () {
      expect(function () {
        expensesUrlRouter.getRedirectUrl({
          query: null
        })
      }).toThrow(Error)
    })
  })
})
