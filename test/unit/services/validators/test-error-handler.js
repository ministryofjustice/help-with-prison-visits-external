const ErrorHandler = require('../../../../app/services/validators/error-handler')

describe('services/validators/error-handler', function () {
  beforeEach(function () {
    this.errorHandler = ErrorHandler()
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
      this.errorHandler.add(FIELD_NAME_1, message, OPTIONS)
      const result = this.errorHandler.get()
      expect(result).toHaveProperty(FIELD_NAME_1)
        .that.is.an('array').toHaveLength(1)
    })

    it('should have three errors saved against the field name if add is called three times', function () {
      this.errorHandler.add(FIELD_NAME_1, message, OPTIONS)
      this.errorHandler.add(FIELD_NAME_1, message, OPTIONS)
      this.errorHandler.add(FIELD_NAME_1, message, OPTIONS)
      const result = this.errorHandler.get()
      expect(result).toHaveProperty(FIELD_NAME_1)
        .that.is.an('array').toHaveLength(3)
    })

    it('should have a property and error for each differnet field name passed to add', function () {
      this.errorHandler.add(FIELD_NAME_1, message, OPTIONS)
      this.errorHandler.add(FIELD_NAME_2, message, OPTIONS)
      const result = this.errorHandler.get()
      expect(result).toHaveProperty(FIELD_NAME_1)
        .that.is.an('array').toHaveLength(1)
      expect(result).toHaveProperty(FIELD_NAME_2)
        .that.is.an('array').toHaveLength(1)
    })
  })

  describe('get', function () {
    it('should return false if no errors are added', function () {
      const result = this.errorHandler.get()
      expect(result).toBe(false)
    })

    it('should ignore fields that have zero length', function () {
      this.errorHandler.errors = { 'some-zero-length-field': '' }
      const result = this.errorHandler.get()
      expect(result).toBe(false)
    })
  })
})
