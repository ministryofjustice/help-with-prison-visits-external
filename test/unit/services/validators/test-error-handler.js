const ErrorHandler = require('../../../../app/services/validators/error-handler')

describe('services/validators/error-handler', function () {
  let errorHandler

  beforeEach(function () {
    errorHandler = ErrorHandler()
    console.log(errorHandler)
  })

  const FIELD_NAME_1 = 'some field name 1'
  const FIELD_NAME_2 = 'some field name 2'
  const MESSAGE = 'some error message'
  const OPTIONS = 'some options'
  const message = function () {
    return MESSAGE
  }

  describe('add', function () {
    it('should return single result if one error is added', function () {
      errorHandler.add(FIELD_NAME_1, message, OPTIONS)
      const result = errorHandler.get()
      expect(result).toHaveProperty(FIELD_NAME_1)
      expect(result[FIELD_NAME_1]).toHaveLength(1)
    })

    it('should have three errors saved against the field name if add is called three times', function () {
      errorHandler.add(FIELD_NAME_1, message, OPTIONS)
      errorHandler.add(FIELD_NAME_1, message, OPTIONS)
      errorHandler.add(FIELD_NAME_1, message, OPTIONS)
      const result = errorHandler.get()
      expect(result).toHaveProperty(FIELD_NAME_1)
      expect(result[FIELD_NAME_1]).toHaveLength(3)
    })

    it('should have a property and error for each differnet field name passed to add', function () {
      errorHandler.add(FIELD_NAME_1, message, OPTIONS)
      errorHandler.add(FIELD_NAME_2, message, OPTIONS)
      const result = errorHandler.get()
      expect(result).toHaveProperty(FIELD_NAME_1)
      expect(result[FIELD_NAME_1]).toHaveLength(1)
      expect(result).toHaveProperty(FIELD_NAME_2)
      expect(result[FIELD_NAME_2]).toHaveLength(1)
    })
  })

  describe('get', function () {
    it('should return false if no errors are added', function () {
      const result = errorHandler.get()
      expect(result).toBe(false)
    })

    it('should ignore fields that have zero length', function () {
      errorHandler.errors = { 'some-zero-length-field': '' }
      const result = errorHandler.get()
      expect(result).toBe(false)
    })
  })
})
