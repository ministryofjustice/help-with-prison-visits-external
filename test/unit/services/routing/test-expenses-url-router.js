const expensesUrlRouter = require('../../../../app/services/routing/expenses-url-router')
const paramBuilder = require('../../../../app/services/routing/param-builder')

describe('services/routing/expenses-url-router', function () {
  describe('parseParams', function () {
    const mockBuildFormatted = jest.fn()

    beforeEach(function () {
      paramBuilder.buildFormatted = mockBuildFormatted
    })

    afterEach(function () {
      jest.resetAllMocks()
    })

    it('should call mockBuildFormatted to build and format the params parameter', function () {
      expensesUrlRouter.parseParams([])
      expect(mockBuildFormatted).toHaveBeenCalledTimes(1)
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
