const expect = require('chai').expect
const validator = require('../../../../app/services/validators/common-validator')

describe('services/validators/common-validator', function () {
  const ALPHA_STRING = 'alpha'
  const ALPHANUMERIC_STRING = 'alpha 123'
  const NUMERIC_STRING = '123'

  describe('isNullOrUndefined', function () {
    it('should return true if passed null', function (done) {
      var result = validator.isNullOrUndefined(null)
      expect(result).to.equal(true)
      done()
    })

    it('should return true if passed undefined', function (done) {
      var result = validator.isNullOrUndefined(undefined)
      expect(result).to.equal(true)
      done()
    })

    it('should return true if passed an empty string', function (done) {
      var result = validator.isNullOrUndefined('')
      expect(result).to.equal(true)
      done()
    })

    it('should return false if passed an object', function (done) {
      var result = validator.isNullOrUndefined({})
      expect(result).to.equal(false)
      done()
    })

    it('should return false if passed an array', function (done) {
      var result = validator.isNullOrUndefined([])
      expect(result).to.equal(false)
      done()
    })

    it('should return false if passed a non empty string', function (done) {
      var result = validator.isNullOrUndefined('any string')
      expect(result).to.equal(false)
      done()
    })
  })

  describe('isAlpha', function () {
    it('should throw an error if passed null', function (done) {
      expect(function () {
        validator.isAlpha(null)
      }).to.throw(TypeError)
      done()
    })

    it('should throw an error if passed undefined', function (done) {
      expect(function () {
        validator.isAlpha(undefined)
      }).to.throw(TypeError)
      done()
    })

    it('should throw an error if passed an object', function (done) {
      expect(function () {
        validator.isAlpha({})
      }).to.throw(TypeError)
      done()
    })

    it('should return true if passed an alpha string', function (done) {
      var result = validator.isAlpha(ALPHA_STRING)
      expect(result).to.equal(true)
      done()
    })

    it('should return false if passed an alphanumeric string', function (done) {
      var result = validator.isAlpha(ALPHANUMERIC_STRING)
      expect(result).to.equal(false)
      done()
    })

    it('should return false if passed a numeric string', function (done) {
      var result = validator.isAlpha(NUMERIC_STRING)
      expect(result).to.equal(false)
      done()
    })
  })

  describe('isNumeric', function () {
    it('should throw an error if passed null', function (done) {
      expect(function () {
        validator.isNumeric(null)
      }).to.throw(TypeError)
      done()
    })

    it('should throw an error if passed undefined', function (done) {
      expect(function () {
        validator.isNumeric(undefined)
      }).to.throw(TypeError)
      done()
    })

    it('should throw an error if passed an object', function (done) {
      expect(function () {
        validator.isNumeric({})
      }).to.throw(TypeError)
      done()
    })

    it('should return false if passed an alpha string', function (done) {
      var result = validator.isNumeric(ALPHA_STRING)
      expect(result).to.equal(false)
      done()
    })

    it('should return false if passed an alphanumeric string', function (done) {
      var result = validator.isNumeric(ALPHANUMERIC_STRING)
      expect(result).to.equal(false)
      done()
    })

    it('should return true if passed a numeric string', function (done) {
      var result = validator.isNumeric(NUMERIC_STRING)
      expect(result).to.equal(true)
      done()
    })
  })

  describe('isLength', function () {
    const LENGTH = 2
    const VALID_STRING = '11'
    const INVALID_STRING = '111'

    it('should throw an error if passed null', function (done) {
      expect(function () {
        validator.isLength(null, null)
      }).to.throw(TypeError)
      done()
    })

    it('should throw an error if passed undefined', function (done) {
      expect(function () {
        validator.isLength(undefined, undefined)
      }).to.throw(TypeError)
      done()
    })

    it('should throw an error if passed an object', function (done) {
      expect(function () {
        validator.isLength({}, {})
      }).to.throw(TypeError)
      done()
    })

    it('should return true if passed a string that has the same length as the length parameter', function (done) {
      var result = validator.isLength(VALID_STRING, LENGTH)
      expect(result).to.equal(true)
      done()
    })

    it('should return false if passed a string that does not have the same length as the length parameter', function (done) {
      var result = validator.isLength(INVALID_STRING, LENGTH)
      expect(result).to.equal(false)
      done()
    })
  })

  describe('isDateValid', function () {
    it('should return false if passed null', function (done) {
      var result = validator.isDateValid(null)
      expect(result).to.equal(false)
      done()
    })

    it('should return false if passed undefined', function (done) {
      var result = validator.isDateValid(undefined)
      expect(result).to.equal(false)
      done()
    })

    it('should return false if passed an object', function (done) {
      var result = validator.isDateValid({})
      expect(result).to.equal(false)
      done()
    })

    it('should return true if passed a valid Date object', function (done) {
      var result = validator.isDateValid(new Date())
      expect(result).to.equal(true)
      done()
    })
  })

  describe('isDateInThePast', function () {
    const PAST_DATE = new Date('1950', '1', '1')
    const FUTURE_DATE = new Date('3000', '1', '1')

    it('should return false if passed null', function (done) {
      var result = validator.isDateInThePast(null)
      expect(result).to.equal(false)
      done()
    })

    it('should return false if passed undefined', function (done) {
      var result = validator.isDateInThePast(undefined)
      expect(result).to.equal(false)
      done()
    })

    it('should return false if passed an object', function (done) {
      var result = validator.isDateInThePast({})
      expect(result).to.equal(false)
      done()
    })

    it('should return true if passed a valid Date object', function (done) {
      var result = validator.isDateInThePast(PAST_DATE)
      expect(result).to.equal(true)
      done()
    })

    it('should return true if passed a valid Date object', function (done) {
      var result = validator.isDateInThePast(FUTURE_DATE)
      expect(result).to.equal(false)
      done()
    })
  })

  // TODO: Add unit tests for isLessThanLength function
  // TODO: Add unit tests for isRange function
  // TODO: Add unit tests for isNationalInsuranceNumber function
  // TODO: Add unit tests for isPostcode function
  // TODO: Add unit tests for isEmail function

  describe('isValidDateOfBirth', function () {
    const PAST_DATE = new Date('1950', '1', '1')
    const FUTURE_DATE = new Date('3000', '1', '1')

    it('should return false if passed null', function (done) {
      var result = validator.isValidDateOfBirth(null)
      expect(result).to.equal(false)
      done()
    })

    it('should return false if passed undefined', function (done) {
      var result = validator.isValidDateOfBirth(undefined)
      expect(result).to.equal(false)
      done()
    })

    it('should return false if passed an object', function (done) {
      var result = validator.isValidDateOfBirth({})
      expect(result).to.equal(false)
      done()
    })

    it('should return true if passed a valid date of birth value', function (done) {
      var result = validator.isValidDateOfBirth(PAST_DATE)
      expect(result).to.equal(true)
      done()
    })

    it('should return true if passed a valid date of birth value', function (done) {
      var result = validator.isValidDateOfBirth(FUTURE_DATE)
      expect(result).to.equal(false)
      done()
    })
  })

  describe('isValidPrisonerRelationship', function () {
    const VALID_INPUT = 'partner'
    const INVALID_INPUT = 'some invalid input'

    it('should return false if passed null', function (done) {
      var result = validator.isValidPrisonerRelationship(null)
      expect(result).to.equal(false)
      done()
    })

    it('should return false if passed undefined', function (done) {
      var result = validator.isValidPrisonerRelationship(undefined)
      expect(result).to.equal(false)
      done()
    })

    it('should return false if passed an object', function (done) {
      var result = validator.isValidPrisonerRelationship({})
      expect(result).to.equal(false)
      done()
    })

    it('should return true if passed a valid prisoner relationship', function (done) {
      var result = validator.isValidPrisonerRelationship(VALID_INPUT)
      expect(result).to.equal(true)
      done()
    })

    it('should return false if passed an invalid prisoner relationship', function (done) {
      var result = validator.isValidPrisonerRelationship(INVALID_INPUT)
      expect(result).to.equal(false)
      done()
    })
  })

  describe('isValidJourneyAssistance', function () {
    const VALID_INPUT = 'no'
    const INVALID_INPUT = 'some invalid input'

    it('should return false if passed null', function (done) {
      var result = validator.isValidJourneyAssistance(null)
      expect(result).to.equal(false)
      done()
    })

    it('should return false if passed undefined', function (done) {
      var result = validator.isValidJourneyAssistance(undefined)
      expect(result).to.equal(false)
      done()
    })

    it('should return false if passed an object', function (done) {
      var result = validator.isValidJourneyAssistance({})
      expect(result).to.equal(false)
      done()
    })

    it('should return true if passed a valid journey ssistance value', function (done) {
      var result = validator.isValidJourneyAssistance(VALID_INPUT)
      expect(result).to.equal(true)
      done()
    })

    it('should return false if passed an invalid journey assistance value', function (done) {
      var result = validator.isValidJourneyAssistance(INVALID_INPUT)
      expect(result).to.equal(false)
      done()
    })
  })

  describe('isValidBenefitResponse', function () {
    const VALID_INPUT = 'no'
    const INVALID_INPUT = 'some invalid input'

    it('should return false if passed null', function (done) {
      var result = validator.isValidBenefitResponse(null)
      expect(result).to.equal(false)
      done()
    })

    it('should return false if passed undefined', function (done) {
      var result = validator.isValidBenefitResponse(undefined)
      expect(result).to.equal(false)
      done()
    })

    it('should return false if passed an object', function (done) {
      var result = validator.isValidBenefitResponse({})
      expect(result).to.equal(false)
      done()
    })

    it('should return true if passed a valid benefit value', function (done) {
      var result = validator.isValidBenefitResponse(VALID_INPUT)
      expect(result).to.equal(true)
      done()
    })

    it('should return false if passed an invalid benefit value', function (done) {
      var result = validator.isValidBenefitResponse(INVALID_INPUT)
      expect(result).to.equal(false)
      done()
    })
  })

  describe('isValidReference', function () {
    const VALID_INPUT = '49CCADM'
    const INVALID_INPUT = 'some invalid input'

    it('should return false if passed null', function (done) {
      var result = validator.isValidReference(null)
      expect(result).to.equal(false)
      done()
    })

    it('should return false if passed undefined', function (done) {
      var result = validator.isValidReference(undefined)
      expect(result).to.equal(false)
      done()
    })

    it('should throw Error if passed an object', function (done) {
      expect(function () {
        validator.isValidReference({})
      }).to.throw(TypeError)
      done()
    })

    it('should return true if passed a valid reference value', function (done) {
      var result = validator.isValidReference(VALID_INPUT)
      expect(result).to.equal(true)
      done()
    })

    it('should return false if passed an invalid reference value', function (done) {
      var result = validator.isValidReference(INVALID_INPUT)
      expect(result).to.equal(false)
      done()
    })
  })
})
