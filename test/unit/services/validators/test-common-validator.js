const expect = require('chai').expect
const validator = require('../../../../app/services/validators/common-validator')
const moment = require('moment')

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

  describe('isLessThanLength', function () {
    const LENGTH = 10
    const VALID_STRING = '11111'
    const INVALID_STRING = '11111111111111111111'

    it('should throw an error if passed null', function (done) {
      expect(function () {
        validator.isLessThanLength(null, null)
      }).to.throw(TypeError)
      done()
    })

    it('should throw an error if passed undefined', function (done) {
      expect(function () {
        validator.isLessThanLength(undefined, undefined)
      }).to.throw(TypeError)
      done()
    })

    it('should throw an error if passed an object', function (done) {
      expect(function () {
        validator.isLessThanLength({}, {})
      }).to.throw(TypeError)
      done()
    })

    it('should return true if passed a string that has a valid length', function (done) {
      var result = validator.isLessThanLength(VALID_STRING, LENGTH)
      expect(result).to.equal(true)
      done()
    })

    it('should return false if passed a string that has an invalid length', function (done) {
      var result = validator.isLessThanLength(INVALID_STRING, LENGTH)
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
      var result = validator.isDateValid(moment())
      expect(result).to.equal(true)
      done()
    })

    it('should return false if passed a Date more than 120 years ago', function (done) {
      var numYearsToSubtract = 130
      var result = validator.isDateValid(moment().subtract(numYearsToSubtract, 'years'))
      expect(result).to.equal(false)
      done()
    })
  })

  describe('isDateInThePast', function () {
    const PAST_DATE = moment().subtract(1, 'day')
    const FUTURE_DATE = moment().add(1, 'day')

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

    it('should return false if passed an invalid Date object', function (done) {
      var result = validator.isDateInThePast(FUTURE_DATE)
      expect(result).to.equal(false)
      done()
    })
  })

  describe('isRange', function () {
    const ACCEPTED_MIN = '2'
    const ACCEPTED_MAX = '5'
    const VALID_LENGTH = '11'
    const INVALID_LENGTH = '111111'

    it('should throw an error if passed null', function (done) {
      expect(function () {
        validator.isRange(null, null, null)
      }).to.throw(TypeError)
      done()
    })

    it('should throw an error if passed undefined', function (done) {
      expect(function () {
        validator.isRange(undefined, undefined, undefined)
      }).to.throw(TypeError)
      done()
    })

    it('should throw an error if passed an object', function (done) {
      expect(function () {
        validator.isRange({}, {}, {})
      }).to.throw(TypeError)
      done()
    })

    it('should return true if passed a string that has a valid length', function (done) {
      var result = validator.isRange(VALID_LENGTH, ACCEPTED_MIN, ACCEPTED_MAX)
      expect(result).to.equal(true)
      done()
    })

    it('should return false if passed a string that has an invalid length', function (done) {
      var result = validator.isRange(INVALID_LENGTH, ACCEPTED_MIN, ACCEPTED_MAX)
      expect(result).to.equal(false)
      done()
    })
  })

  describe('isNationalInsuranceNumber', function () {
    const VALID_STRING = 'AA123456A'
    const INVALID_STRING = 'AAA23456A'

    it('should throw an error if passed null', function (done) {
      expect(function () {
        validator.isNationalInsuranceNumber(null)
      }).to.throw(TypeError)
      done()
    })

    it('should throw an error if passed undefined', function (done) {
      expect(function () {
        validator.isNationalInsuranceNumber(undefined)
      }).to.throw(TypeError)
      done()
    })

    it('should throw an error if passed an object', function (done) {
      expect(function () {
        validator.isNationalInsuranceNumber({})
      }).to.throw(TypeError)
      done()
    })

    it('should return true if passed a string that has a valid format', function (done) {
      var result = validator.isNationalInsuranceNumber(VALID_STRING)
      expect(result).to.equal(true)
      done()
    })

    it('should return false if passed a string that has an invalid format', function (done) {
      var result = validator.isNationalInsuranceNumber(INVALID_STRING)
      expect(result).to.equal(false)
      done()
    })
  })

  describe('isPostcode', function () {
    const VALID_STRING = 'AA123AA'
    const INVALID_STRING = '1234567'

    it('should throw an error if passed null', function (done) {
      expect(function () {
        validator.isPostcode(null)
      }).to.throw(TypeError)
      done()
    })

    it('should throw an error if passed undefined', function (done) {
      expect(function () {
        validator.isPostcode(undefined)
      }).to.throw(TypeError)
      done()
    })

    it('should throw an error if passed an object', function (done) {
      expect(function () {
        validator.isPostcode({})
      }).to.throw(TypeError)
      done()
    })

    it('should return true if passed a string that has a valid format', function (done) {
      var result = validator.isPostcode(VALID_STRING)
      expect(result).to.equal(true)
      done()
    })

    it('should return false if passed a string that has an invalid format', function (done) {
      var result = validator.isPostcode(INVALID_STRING)
      expect(result).to.equal(false)
      done()
    })
  })

  describe('isEmail', function () {
    const VALID_STRING = 'test@test.com'
    const INVALID_STRING = 'test.test.com'

    it('should throw an error if passed null', function (done) {
      expect(function () {
        validator.isEmail(null)
      }).to.throw(TypeError)
      done()
    })

    it('should throw an error if passed undefined', function (done) {
      expect(function () {
        validator.isEmail(undefined)
      }).to.throw(TypeError)
      done()
    })

    it('should throw an error if passed an object', function (done) {
      expect(function () {
        validator.isEmail({})
      }).to.throw(TypeError)
      done()
    })

    it('should return true if passed a string that has a valid format', function (done) {
      var result = validator.isEmail(VALID_STRING)
      expect(result).to.equal(true)
      done()
    })

    it('should return false if passed a string that has an invalid format', function (done) {
      var result = validator.isEmail(INVALID_STRING)
      expect(result).to.equal(false)
      done()
    })
  })

  describe('isCurrency', function () {
    const VALID_INTEGER = '20'
    const VALID_DECIMAL = '20.00'
    const INVALID_STRING = 'invalid'
    const INVALID_NUMERIC = '-20'

    it('should throw an error if passed null', function (done) {
      expect(function () {
        validator.isCurrency(null)
      }).to.throw(TypeError)
      done()
    })

    it('should throw an error if passed undefined', function (done) {
      expect(function () {
        validator.isCurrency(undefined)
      }).to.throw(TypeError)
      done()
    })

    it('should throw an error if passed an object', function (done) {
      expect(function () {
        validator.isCurrency({})
      }).to.throw(TypeError)
      done()
    })

    it('should return true if passed a numeric string', function (done) {
      var result = validator.isCurrency(VALID_INTEGER)
      expect(result).to.equal(true)
      done()
    })

    it('should return true if passed a numeric string to 2 decimal places', function (done) {
      var result = validator.isCurrency(VALID_DECIMAL)
      expect(result).to.equal(true)
      done()
    })

    it('should return false if passed a non-numeric string', function (done) {
      var result = validator.isCurrency(INVALID_STRING)
      expect(result).to.equal(false)
      done()
    })

    it('should return false if passed a negative numeric string', function (done) {
      var result = validator.isCurrency(INVALID_NUMERIC)
      expect(result).to.equal(false)
      done()
    })
  })

  describe('isValidDateOfBirth', function () {
    const PAST_DATE = moment().subtract(1, 'day')
    const FUTURE_DATE = moment().add(1, 'day')

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

    it('should return false if passed an invalid date of birth value', function (done) {
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
