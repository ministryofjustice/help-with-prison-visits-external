const expect = require('chai').expect
const FieldValidator = require('../../../../app/services/validators/field-validator')
const ErrorHandler = require('../../../../app/services/validators/error-handler')

describe('services/validators/field-validator', function () {
  const VALID_ALPHA = 'data'
  const VALID_NUMERIC = '1'
  const INVALID_DATA = ''
  const INVALID_FORMAT_DATA = 'AAAAAA1'
  const FIELD_NAME = 'field name'
  const VALID_POSTCODE = 'BT123BT'
  const VALID_NATIONAL_INSURANCE_NUMBER = 'AA123456B'
  const VALID_EMAIL = 'test1@tester.com'
  const ERROR_HANDLER = ErrorHandler()

  describe('isRequired', function () {
    const QUESTION_TYPE = 'radio'

    it('should reach radio branch if radio is passed.', function (done) {
      var errorHandler = ErrorHandler()
      FieldValidator(null, FIELD_NAME, errorHandler)
        .isRequired(QUESTION_TYPE)
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
      done()
    })

    it('should return an error object if passed null', function (done) {
      var errorHandler = ErrorHandler()
      FieldValidator(null, FIELD_NAME, errorHandler)
        .isRequired()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
      done()
    })

    it('should return an error object if passed undefined', function (done) {
      var errorHandler = ErrorHandler()
      FieldValidator(undefined, FIELD_NAME, errorHandler)
        .isRequired()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
      done()
    })

    it('should throw error if data is an object', function (done) {
      var errorHandler = ErrorHandler()
      FieldValidator({}, FIELD_NAME, errorHandler)
        .isRequired()
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
      done()
    })

    it('should return false if passed valid data', function (done) {
      var errorHandler = ErrorHandler()
      FieldValidator(VALID_ALPHA, FIELD_NAME, errorHandler)
        .isRequired()
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
      done()
    })

    it('should return an error object if passed invalid data', function (done) {
      var errorHandler = ErrorHandler()
      FieldValidator(INVALID_DATA, FIELD_NAME, errorHandler)
        .isRequired()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
      done()
    })
  })

  describe('isAlpha', function () {
    it('should throw error if data is null', function (done) {
      expect(function () {
        FieldValidator(null, FIELD_NAME, ERROR_HANDLER)
          .isAlpha()
      }).to.throw(TypeError)
      done()
    })

    it('should throw error if data is undefined', function (done) {
      expect(function () {
        FieldValidator(undefined, FIELD_NAME, ERROR_HANDLER)
          .isAlpha()
      }).to.throw(TypeError)
      done()
    })

    it('should throw error if data is an object', function (done) {
      expect(function () {
        FieldValidator({}, FIELD_NAME, ERROR_HANDLER)
          .isAlpha()
      }).to.throw(TypeError)
      done()
    })

    it('should return false if passed valid data', function (done) {
      var errorHandler = ErrorHandler()
      FieldValidator(VALID_ALPHA, FIELD_NAME, errorHandler)
        .isAlpha()
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
      done()
    })

    it('should return an error object if passed invalid data', function (done) {
      var errorHandler = ErrorHandler()
      FieldValidator(INVALID_DATA, FIELD_NAME, errorHandler)
        .isAlpha()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
      done()
    })
  })

  describe('isNumeric', function () {
    it('should throw error if data is null', function (done) {
      expect(function () {
        FieldValidator(null, FIELD_NAME, ERROR_HANDLER)
          .isNumeric()
      }).to.throw(TypeError)
      done()
    })

    it('should throw error if data is undefined', function (done) {
      expect(function () {
        FieldValidator(undefined, FIELD_NAME, ERROR_HANDLER)
          .isNumeric()
      }).to.throw(TypeError)
      done()
    })

    it('should throw error if data is an object', function (done) {
      expect(function () {
        FieldValidator({}, FIELD_NAME, ERROR_HANDLER)
          .isNumeric()
      }).to.throw(TypeError)
      done()
    })

    it('should return false if passed valid data', function (done) {
      var errorHandler = ErrorHandler()
      FieldValidator(VALID_NUMERIC, FIELD_NAME, errorHandler)
        .isNumeric()
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
      done()
    })

    it('should return an error object if passed invalid data', function (done) {
      var errorHandler = ErrorHandler()
      FieldValidator(INVALID_DATA, FIELD_NAME, errorHandler)
        .isNumeric()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
      done()
    })
  })

  describe('isLength', function () {
    const ACCEPTED_LENGTH = '2'
    const VALID_LENGTH = '11'
    const INVALID_LENGTH = '111'

    it('should throw error if data is null', function (done) {
      expect(function () {
        FieldValidator(null, FIELD_NAME, ERROR_HANDLER)
          .isLength()
      }).to.throw(TypeError)
      done()
    })

    it('should throw error if data is undefined', function (done) {
      expect(function () {
        FieldValidator(undefined, FIELD_NAME, ERROR_HANDLER)
          .isLength()
      }).to.throw(TypeError)
      done()
    })

    it('should throw error if data is an object', function (done) {
      expect(function () {
        FieldValidator({}, FIELD_NAME, ERROR_HANDLER)
          .isLength()
      }).to.throw(TypeError)
      done()
    })

    it('should return false if passed valid data', function (done) {
      var errorHandler = ErrorHandler()
      FieldValidator(VALID_LENGTH, FIELD_NAME, errorHandler)
        .isLength(ACCEPTED_LENGTH)
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
      done()
    })

    it('should return an error object if passed invalid data', function (done) {
      var errorHandler = ErrorHandler()
      FieldValidator(INVALID_LENGTH, FIELD_NAME, errorHandler)
        .isLength(ACCEPTED_LENGTH)
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
      done()
    })
  })

  describe('isNationalInsuranceNumber', function () {
    it('should throw error if data is null', function (done) {
      expect(function () {
        FieldValidator(null, FIELD_NAME, ERROR_HANDLER)
          .isNationalInsuranceNumber()
      }).to.throw(TypeError)
      done()
    })

    it('should throw error if data is undefined', function (done) {
      expect(function () {
        FieldValidator(undefined, FIELD_NAME, ERROR_HANDLER)
          .isNationalInsuranceNumber()
      }).to.throw(TypeError)
      done()
    })

    it('should throw error if data is an object', function (done) {
      expect(function () {
        FieldValidator({}, FIELD_NAME, ERROR_HANDLER)
          .isNationalInsuranceNumber()
      }).to.throw(TypeError)
      done()
    })

    it('should return false if passed valid data', function (done) {
      var errorHandler = ErrorHandler()
      FieldValidator(VALID_NATIONAL_INSURANCE_NUMBER, FIELD_NAME, errorHandler)
        .isNationalInsuranceNumber()
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
      done()
    })

    it('should return an error object if passed invalid data', function (done) {
      var errorHandler = ErrorHandler()
      FieldValidator(INVALID_FORMAT_DATA, FIELD_NAME, errorHandler)
        .isNationalInsuranceNumber()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
      done()
    })
  })

  describe('isPostcode', function () {
    it('should throw error if data is null', function (done) {
      expect(function () {
        FieldValidator(null, FIELD_NAME, ERROR_HANDLER)
          .isPostcode()
      }).to.throw(TypeError)
      done()
    })

    it('should throw error if data is undefined', function (done) {
      expect(function () {
        FieldValidator(undefined, FIELD_NAME, ERROR_HANDLER)
          .isPostcode()
      }).to.throw(TypeError)
      done()
    })

    it('should throw error if data is an object', function (done) {
      expect(function () {
        FieldValidator({}, FIELD_NAME, ERROR_HANDLER)
          .isPostcode()
      }).to.throw(TypeError)
      done()
    })

    it('should return false if passed valid data', function (done) {
      var errorHandler = ErrorHandler()
      FieldValidator(VALID_POSTCODE, FIELD_NAME, errorHandler)
        .isPostcode()
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
      done()
    })

    it('should return an error object if passed invalid data', function (done) {
      var errorHandler = ErrorHandler()
      FieldValidator(INVALID_FORMAT_DATA, FIELD_NAME, errorHandler)
        .isPostcode()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
      done()
    })
  })

  describe('isEmail', function () {
    it('should throw error if data is null', function (done) {
      expect(function () {
        FieldValidator(null, FIELD_NAME, ERROR_HANDLER)
          .isEmail()
      }).to.throw(TypeError)
      done()
    })

    it('should throw error if data is undefined', function (done) {
      expect(function () {
        FieldValidator(undefined, FIELD_NAME, ERROR_HANDLER)
          .isEmail()
      }).to.throw(TypeError)
      done()
    })

    it('should throw error if data is an object', function (done) {
      expect(function () {
        FieldValidator({}, FIELD_NAME, ERROR_HANDLER)
          .isEmail()
      }).to.throw(TypeError)
      done()
    })

    it('should return false if passed valid data', function (done) {
      var errorHandler = ErrorHandler()
      FieldValidator(VALID_EMAIL, FIELD_NAME, errorHandler)
        .isEmail()
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
      done()
    })

    it('should return an error object if passed invalid data', function (done) {
      var errorHandler = ErrorHandler()
      FieldValidator(INVALID_FORMAT_DATA, FIELD_NAME, errorHandler)
        .isEmail()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
      done()
    })
  })

  describe('isRange', function () {
    const ACCEPTED_MIN = '2'
    const ACCEPTED_MAX = '5'
    const VALID_LENGTH = '11'
    const INVALID_LENGTH = '111111'

    it('should throw error if data is null', function (done) {
      expect(function () {
        FieldValidator(null, FIELD_NAME, ERROR_HANDLER)
          .isRange()
      }).to.throw(TypeError)
      done()
    })

    it('should throw error if data is undefined', function (done) {
      expect(function () {
        FieldValidator(undefined, FIELD_NAME, ERROR_HANDLER)
          .isRange()
      }).to.throw(TypeError)
      done()
    })

    it('should throw error if data is an object', function (done) {
      expect(function () {
        FieldValidator({}, FIELD_NAME, ERROR_HANDLER)
          .isRange()
      }).to.throw(TypeError)
      done()
    })

    it('should return false if passed valid data', function (done) {
      var errorHandler = ErrorHandler()
      FieldValidator(VALID_LENGTH, FIELD_NAME, errorHandler)
        .isRange(ACCEPTED_MIN, ACCEPTED_MAX)
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
      done()
    })

    it('should return an error object if passed invalid data', function (done) {
      var errorHandler = ErrorHandler()
      FieldValidator(INVALID_LENGTH, FIELD_NAME, errorHandler)
        .isRange(ACCEPTED_MIN, ACCEPTED_MAX)
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
      done()
    })
  })

  describe('isLessThanLength', function () {
    const ACCEPTED_LENGTH = '10'
    const VALID_LENGTH = '11111'
    const INVALID_LENGTH = '111111111111111'

    it('should throw error if data is null', function (done) {
      expect(function () {
        FieldValidator(null, FIELD_NAME, ERROR_HANDLER)
          .isLessThanLength()
      }).to.throw(TypeError)
      done()
    })

    it('should throw error if data is undefined', function (done) {
      expect(function () {
        FieldValidator(undefined, FIELD_NAME, ERROR_HANDLER)
          .isLessThanLength()
      }).to.throw(TypeError)
      done()
    })

    it('should throw error if data is an object', function (done) {
      expect(function () {
        FieldValidator({}, FIELD_NAME, ERROR_HANDLER)
          .isLessThanLength()
      }).to.throw(TypeError)
      done()
    })

    it('should return false if passed valid data', function (done) {
      var errorHandler = ErrorHandler()
      FieldValidator(VALID_LENGTH, FIELD_NAME, errorHandler)
        .isLessThanLength(ACCEPTED_LENGTH)
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
      done()
    })

    it('should return an error object if passed invalid data', function (done) {
      var errorHandler = ErrorHandler()
      FieldValidator(INVALID_LENGTH, FIELD_NAME, errorHandler)
        .isLessThanLength(ACCEPTED_LENGTH)
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
      done()
    })
  })

  describe('isReference', function () {
    const VALID_REFERENCE = 'APVS123'
    const INVALID_REFERENCE = 'APVS1234'

    it('should return false if data is null', function (done) {
      var errorHandler = ErrorHandler()
      FieldValidator(null, FIELD_NAME, errorHandler)
        .isReference()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
      done()
    })

    it('should throw error if data is undefined', function (done) {
      var errorHandler = ErrorHandler()
      FieldValidator(undefined, FIELD_NAME, errorHandler)
        .isReference()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
      done()
    })

    it('should throw error if data is an object', function (done) {
      var errorHandler = ErrorHandler()
      expect(function () {
        FieldValidator({}, FIELD_NAME, errorHandler)
          .isReference()
      }).to.throw(TypeError)
      done()
    })

    it('should return false if passed valid data', function (done) {
      var errorHandler = ErrorHandler()
      FieldValidator(VALID_REFERENCE, FIELD_NAME, errorHandler)
        .isReference()
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
      done()
    })

    it('should return an error object if passed invalid data', function (done) {
      var errorHandler = ErrorHandler()
      FieldValidator(INVALID_REFERENCE, FIELD_NAME, errorHandler)
        .isReference()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
      done()
    })
  })

  describe('isCurrency', function () {
    const VALID_INPUT = '20'
    const INVALID_INPUT = 'invalid'

    it('should throw error if data is null', function (done) {
      expect(function () {
        FieldValidator(null, FIELD_NAME, ERROR_HANDLER)
          .isCurrency()
      }).to.throw(TypeError)
      done()
    })

    it('should throw error if data is undefined', function (done) {
      expect(function () {
        FieldValidator(undefined, FIELD_NAME, ERROR_HANDLER)
          .isCurrency()
      }).to.throw(TypeError)
      done()
    })

    it('should throw error if data is an object', function (done) {
      expect(function () {
        FieldValidator({}, FIELD_NAME, ERROR_HANDLER)
          .isCurrency()
      }).to.throw(TypeError)
      done()
    })

    it('should return false if passed valid data', function (done) {
      var errorHandler = ErrorHandler()
      FieldValidator(VALID_INPUT, FIELD_NAME, errorHandler)
        .isCurrency()
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
      done()
    })

    it('should return an error object if passed invalid data', function (done) {
      var errorHandler = ErrorHandler()
      FieldValidator(INVALID_INPUT, FIELD_NAME, errorHandler)
        .isCurrency()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
      done()
    })
  })

  describe('isGreaterThanZero', function () {
    const VALID_INPUT = '20'
    const INVALID_INPUT = '0'

    it('should throw error if data is null', function (done) {
      expect(function () {
        FieldValidator(null, FIELD_NAME, ERROR_HANDLER)
          .isGreaterThanZero()
      }).to.throw(TypeError)
      done()
    })

    it('should throw error if data is undefined', function (done) {
      expect(function () {
        FieldValidator(undefined, FIELD_NAME, ERROR_HANDLER)
          .isGreaterThanZero()
      }).to.throw(TypeError)
      done()
    })

    it('should throw error if data is an object', function (done) {
      expect(function () {
        FieldValidator({}, FIELD_NAME, ERROR_HANDLER)
          .isGreaterThanZero()
      }).to.throw(TypeError)
      done()
    })

    it('should return false if passed a numeric value greater than zero', function (done) {
      var errorHandler = ErrorHandler()
      FieldValidator(VALID_INPUT, FIELD_NAME, errorHandler)
        .isGreaterThanZero()
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
      done()
    })

    it('should return an error object if passed a value less than or equal to zero', function (done) {
      var errorHandler = ErrorHandler()
      FieldValidator(INVALID_INPUT, FIELD_NAME, errorHandler)
        .isGreaterThanZero()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
      done()
    })
  })
})
