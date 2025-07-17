const expensesUrlRouter = require('../../../../app/services/routing/expenses-url-router')
const paramBuilder = require('../../../../app/services/routing/param-builder')

describe('services/routing/expenses-url-router', () => {
  describe('parseParams', () => {
    const mockBuildFormatted = jest.fn()

    beforeEach(() => {
      paramBuilder.buildFormatted = mockBuildFormatted
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    it('should call mockBuildFormatted to build and format the params parameter', () => {
      expensesUrlRouter.parseParams([])
      expect(mockBuildFormatted).toHaveBeenCalledTimes(1)
    })
  })

  describe('getRedirectUrl', () => {
    it('should throw an error if req is invalid', () => {
      expect(() => {
        expensesUrlRouter.getRedirectUrl(null)
      }).toThrow(Error)
    })

    it('should throw an error if req.body is invalid', () => {
      expect(() => {
        expensesUrlRouter.getRedirectUrl({
          body: null,
        })
      }).toThrow(Error)
    })

    it('should throw an error if req.params is invalid', () => {
      expect(() => {
        expensesUrlRouter.getRedirectUrl({
          params: null,
        })
      }).toThrow(Error)
    })

    it('should throw an error if req.params.referenceId is invalid', () => {
      expect(() => {
        expensesUrlRouter.getRedirectUrl({
          params: {
            referenceId: null,
          },
        })
      }).toThrow(Error)
    })

    it('should throw an error if req.params.claimId is invalid', () => {
      expect(() => {
        expensesUrlRouter.getRedirectUrl({
          params: {
            claimId: null,
          },
        })
      }).toThrow(Error)
    })

    it('should throw an error if req.originalUrl is invalid', () => {
      expect(() => {
        expensesUrlRouter.getRedirectUrl({
          originalUrl: null,
        })
      }).toThrow(Error)
    })

    it('should throw an error if req.query is invalid', () => {
      expect(() => {
        expensesUrlRouter.getRedirectUrl({
          query: null,
        })
      }).toThrow(Error)
    })
  })
})
