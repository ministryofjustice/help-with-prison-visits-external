const expect = require('chai').expect
const validator = require('../../../../app/services/validators/common-validator')
const dateFormatter = require('../../../../app/services/date-formatter')
const benefitsEnum = require('../../../../app/constants/benefits-enum')
const childRelationshipEnum = require('../../../../app/constants/child-relationship-enum')
const booleanSelectEnum = require('../../../../app/constants/boolean-select-enum')
const advancePastEnum = require('../../../../app/constants/advance-past-enum')
const claimTypeEnum = require('../../../../app/constants/claim-type-enum')
const expenseTypeEnum = require('../../../../app/constants/expense-type-enum')
const prisonerRelationshipsEnum = require('../../../../app/constants/prisoner-relationships-enum')

describe('services/validators/common-validator', function () {
  const ALPHA_STRING = 'alpha'
  const ALPHANUMERIC_STRING = 'alpha 123'
  const NUMERIC_STRING = '123'

  describe('isNullOrUndefined', function () {
    it('should return true if passed null', function () {
      const result = validator.isNullOrUndefined(null)
      expect(result).to.equal(true)
    })

    it('should return true if passed undefined', function () {
      const result = validator.isNullOrUndefined(undefined)
      expect(result).to.equal(true)
    })

    it('should return true if passed an empty string', function () {
      const result = validator.isNullOrUndefined('')
      expect(result).to.equal(true)
    })

    it('should return false if passed an object', function () {
      const result = validator.isNullOrUndefined({})
      expect(result).to.equal(false)
    })

    it('should return false if passed an array', function () {
      const result = validator.isNullOrUndefined([])
      expect(result).to.equal(false)
    })

    it('should return false if passed a non empty string', function () {
      const result = validator.isNullOrUndefined('any string')
      expect(result).to.equal(false)
    })
  })

  describe('isAlpha', function () {
    it('should throw an error if passed null', function () {
      expect(function () {
        validator.isAlpha(null)
      }).to.throw(TypeError)
    })

    it('should throw an error if passed undefined', function () {
      expect(function () {
        validator.isAlpha(undefined)
      }).to.throw(TypeError)
    })

    it('should throw an error if passed an object', function () {
      expect(function () {
        validator.isAlpha({})
      }).to.throw(TypeError)
    })

    it('should return true if passed an alpha string', function () {
      const result = validator.isAlpha(ALPHA_STRING)
      expect(result).to.equal(true)
    })

    it('should return false if passed an alphanumeric string', function () {
      const result = validator.isAlpha(ALPHANUMERIC_STRING)
      expect(result).to.equal(false)
    })

    it('should return false if passed a numeric string', function () {
      const result = validator.isAlpha(NUMERIC_STRING)
      expect(result).to.equal(false)
    })
  })

  describe('isNumeric', function () {
    it('should throw an error if passed null', function () {
      expect(function () {
        validator.isNumeric(null)
      }).to.throw(TypeError)
    })

    it('should throw an error if passed undefined', function () {
      expect(function () {
        validator.isNumeric(undefined)
      }).to.throw(TypeError)
    })

    it('should throw an error if passed an object', function () {
      expect(function () {
        validator.isNumeric({})
      }).to.throw(TypeError)
    })

    it('should return false if passed an alpha string', function () {
      const result = validator.isNumeric(ALPHA_STRING)
      expect(result).to.equal(false)
    })

    it('should return false if passed an alphanumeric string', function () {
      const result = validator.isNumeric(ALPHANUMERIC_STRING)
      expect(result).to.equal(false)
    })

    it('should return true if passed a numeric string', function () {
      const result = validator.isNumeric(NUMERIC_STRING)
      expect(result).to.equal(true)
    })
  })

  describe('isLength', function () {
    const LENGTH = 2
    const VALID_STRING = '11'
    const INVALID_STRING = '111'

    it('should throw an error if passed null', function () {
      expect(function () {
        validator.isLength(null, null)
      }).to.throw(TypeError)
    })

    it('should throw an error if passed undefined', function () {
      expect(function () {
        validator.isLength(undefined, undefined)
      }).to.throw(TypeError)
    })

    it('should throw an error if passed an object', function () {
      expect(function () {
        validator.isLength({}, {})
      }).to.throw(TypeError)
    })

    it('should return true if passed a string that has the same length as the length parameter', function () {
      const result = validator.isLength(VALID_STRING, LENGTH)
      expect(result).to.equal(true)
    })

    it('should return false if passed a string that does not have the same length as the length parameter', function () {
      const result = validator.isLength(INVALID_STRING, LENGTH)
      expect(result).to.equal(false)
    })
  })

  describe('isLessThanLength', function () {
    const LENGTH = 10
    const VALID_STRING = '11111'
    const INVALID_STRING = '11111111111111111111'

    it('should throw an error if passed null', function () {
      expect(function () {
        validator.isLessThanLength(null, null)
      }).to.throw(TypeError)
    })

    it('should throw an error if passed undefined', function () {
      expect(function () {
        validator.isLessThanLength(undefined, undefined)
      }).to.throw(TypeError)
    })

    it('should throw an error if passed an object', function () {
      expect(function () {
        validator.isLessThanLength({}, {})
      }).to.throw(TypeError)
    })

    it('should return true if passed a string that has a valid length', function () {
      const result = validator.isLessThanLength(VALID_STRING, LENGTH)
      expect(result).to.equal(true)
    })

    it('should return false if passed a string that has an invalid length', function () {
      const result = validator.isLessThanLength(INVALID_STRING, LENGTH)
      expect(result).to.equal(false)
    })
  })

  describe('isValidDate', function () {
    it('should return false if passed null', function () {
      const result = validator.isValidDate(null)
      expect(result).to.equal(false)
    })

    it('should return false if passed undefined', function () {
      const result = validator.isValidDate(undefined)
      expect(result).to.equal(false)
    })

    it('should return false if passed an object', function () {
      const result = validator.isValidDate({})
      expect(result).to.equal(false)
    })

    it('should return true if passed a valid Date object', function () {
      const result = validator.isValidDate(dateFormatter.now())
      expect(result).to.equal(true)
    })

    it('should return false if passed a Date more than 120 years ago', function () {
      const numYearsToSubtract = 130
      const result = validator.isValidDate(dateFormatter.now().subtract(numYearsToSubtract, 'years'))
      expect(result).to.equal(false)
    })
  })

  describe('isDateInThePast', function () {
    const PAST_DATE = dateFormatter.now().subtract(1, 'day')
    const FUTURE_DATE = dateFormatter.now().add(1, 'day')

    it('should return false if passed null', function () {
      const result = validator.isDateInThePast(null)
      expect(result).to.equal(false)
    })

    it('should return false if passed undefined', function () {
      const result = validator.isDateInThePast(undefined)
      expect(result).to.equal(false)
    })

    it('should return false if passed an object', function () {
      const result = validator.isDateInThePast({})
      expect(result).to.equal(false)
    })

    it('should return true if passed a valid Date object', function () {
      const result = validator.isDateInThePast(PAST_DATE)
      expect(result).to.equal(true)
    })

    it('should return false if passed an invalid Date object', function () {
      const result = validator.isDateInThePast(FUTURE_DATE)
      expect(result).to.equal(false)
    })
  })

  describe('isDateInTheFuture', function () {
    const PAST_DATE = dateFormatter.now().subtract(1, 'day')
    const FUTURE_DATE = dateFormatter.now().add(1, 'day')

    it('should return false if passed null', function () {
      const result = validator.isDateInTheFuture(null)
      expect(result).to.equal(false)
    })

    it('should return false if passed undefined', function () {
      const result = validator.isDateInTheFuture(undefined)
      expect(result).to.equal(false)
    })

    it('should return false if passed an object', function () {
      const result = validator.isDateInTheFuture({})
      expect(result).to.equal(false)
    })

    it('should return true if passed a valid Date object', function () {
      const result = validator.isDateInTheFuture(FUTURE_DATE)
      expect(result).to.equal(true)
    })

    it('should return false if passed an invalid Date object', function () {
      const result = validator.isDateInTheFuture(PAST_DATE)
      expect(result).to.equal(false)
    })
  })

  describe('isDateWithinDays', function () {
    const DAYS = 28
    const DATE_WITHIN_28_DAYS = dateFormatter.now().startOf('day').subtract(1, 'days')
    const DATE_OUTSIDE_28_DAYS = dateFormatter.now().startOf('day').subtract(29, 'days')

    it('should return true if passed a valid Date object', function () {
      const result = validator.isDateWithinDays(DATE_WITHIN_28_DAYS, DAYS)
      expect(result).to.equal(true)
    })

    it('should return false if passed an invalid Date object', function () {
      const result = validator.isDateWithinDays(DATE_OUTSIDE_28_DAYS, DAYS)
      expect(result).to.equal(false)
    })
  })

  describe('isNotDateWithinDays', function () {
    const DAYS = 5
    const DATE_WITHIN_5_DAYS = dateFormatter.now().startOf('day').add(1, 'days')
    const DATE_OUTSIDE_5_DAYS = dateFormatter.now().startOf('day').add(6, 'days')

    it('should return true if passed a valid Date object', function () {
      const result = validator.isNotDateWithinDays(DATE_OUTSIDE_5_DAYS, DAYS)
      expect(result).to.equal(true)
    })

    it('should return false if passed an invalid Date object', function () {
      const result = validator.isNotDateWithinDays(DATE_WITHIN_5_DAYS, DAYS)
      expect(result).to.equal(false)
    })
  })

  describe('isOlderThanInYears', function () {
    const YEARS = 18
    const OLDER_THAN_DOB = dateFormatter.now().subtract(YEARS, 'years')
    const YOUNGER_THAN_DOB = dateFormatter.now()

    it('should return false if passed null', function () {
      const result = validator.isOlderThanInYears(null)
      expect(result).to.equal(false)
    })

    it('should return false if passed undefined', function () {
      const result = validator.isOlderThanInYears(undefined)
      expect(result).to.equal(false)
    })

    it('should return false if passed an object', function () {
      const result = validator.isOlderThanInYears({})
      expect(result).to.equal(false)
    })

    it(`should return true if passed a DOB whose age is greater than ${YEARS} years.`, function () {
      const result = validator.isOlderThanInYears(OLDER_THAN_DOB, YEARS)
      expect(result).to.equal(true)
    })

    it(`should return false if passed a DOB whose age is less than ${YEARS} years.`, function () {
      const result = validator.isOlderThanInYears(YOUNGER_THAN_DOB, YEARS)
      expect(result).to.equal(false)
    })
  })

  describe('isRange', function () {
    const ACCEPTED_MIN = '2'
    const ACCEPTED_MAX = '5'
    const VALID_LENGTH = '11'
    const INVALID_LENGTH = '111111'

    it('should throw an error if passed null', function () {
      expect(function () {
        validator.isRange(null, null, null)
      }).to.throw(TypeError)
    })

    it('should throw an error if passed undefined', function () {
      expect(function () {
        validator.isRange(undefined, undefined, undefined)
      }).to.throw(TypeError)
    })

    it('should throw an error if passed an object', function () {
      expect(function () {
        validator.isRange({}, {}, {})
      }).to.throw(TypeError)
    })

    it('should return true if passed a string that has a valid length', function () {
      const result = validator.isRange(VALID_LENGTH, ACCEPTED_MIN, ACCEPTED_MAX)
      expect(result).to.equal(true)
    })

    it('should return false if passed a string that has an invalid length', function () {
      const result = validator.isRange(INVALID_LENGTH, ACCEPTED_MIN, ACCEPTED_MAX)
      expect(result).to.equal(false)
    })
  })

  describe('isNationalInsuranceNumber', function () {
    const VALID_STRING = 'AA123456A'
    const INVALID_STRING = 'AAA23456A'

    it('should throw an error if passed null', function () {
      expect(function () {
        validator.isNationalInsuranceNumber(null)
      }).to.throw(TypeError)
    })

    it('should throw an error if passed undefined', function () {
      expect(function () {
        validator.isNationalInsuranceNumber(undefined)
      }).to.throw(TypeError)
    })

    it('should throw an error if passed an object', function () {
      expect(function () {
        validator.isNationalInsuranceNumber({})
      }).to.throw(TypeError)
    })

    it('should return true if passed a string that has a valid format', function () {
      const result = validator.isNationalInsuranceNumber(VALID_STRING)
      expect(result).to.equal(true)
    })

    it('should return false if passed a string that has an invalid format', function () {
      const result = validator.isNationalInsuranceNumber(INVALID_STRING)
      expect(result).to.equal(false)
    })
  })

  describe('isPostcode', function () {
    const VALID_STRING = 'AA123AA'
    const INVALID_STRING = '1234567'

    it('should throw an error if passed null', function () {
      expect(function () {
        validator.isPostcode(null)
      }).to.throw(TypeError)
    })

    it('should throw an error if passed undefined', function () {
      expect(function () {
        validator.isPostcode(undefined)
      }).to.throw(TypeError)
    })

    it('should throw an error if passed an object', function () {
      expect(function () {
        validator.isPostcode({})
      }).to.throw(TypeError)
    })

    it('should return true if passed a string that has a valid format', function () {
      const result = validator.isPostcode(VALID_STRING)
      expect(result).to.equal(true)
    })

    it('should return false if passed a string that has an invalid format', function () {
      const result = validator.isPostcode(INVALID_STRING)
      expect(result).to.equal(false)
    })
  })

  describe('isEmail', function () {
    const VALID_STRING = 'test@test.com'
    const INVALID_STRING = 'test.test.com'

    it('should throw an error if passed null', function () {
      expect(function () {
        validator.isEmail(null)
      }).to.throw(TypeError)
    })

    it('should throw an error if passed undefined', function () {
      expect(function () {
        validator.isEmail(undefined)
      }).to.throw(TypeError)
    })

    it('should throw an error if passed an object', function () {
      expect(function () {
        validator.isEmail({})
      }).to.throw(TypeError)
    })

    it('should return true if passed a string that has a valid format', function () {
      const result = validator.isEmail(VALID_STRING)
      expect(result).to.equal(true)
    })

    it('should return false if passed a string that has an invalid format', function () {
      const result = validator.isEmail(INVALID_STRING)
      expect(result).to.equal(false)
    })
  })

  describe('isCurrency', function () {
    const VALID_INTEGER = '20'
    const VALID_DECIMAL = '20.00'
    const INVALID_STRING = 'invalid'

    it('should throw an error if passed null', function () {
      expect(function () {
        validator.isCurrency(null)
      }).to.throw(TypeError)
    })

    it('should throw an error if passed undefined', function () {
      expect(function () {
        validator.isCurrency(undefined)
      }).to.throw(TypeError)
    })

    it('should throw an error if passed an object', function () {
      expect(function () {
        validator.isCurrency({})
      }).to.throw(TypeError)
    })

    it('should return true if passed a numeric string', function () {
      const result = validator.isCurrency(VALID_INTEGER)
      expect(result).to.equal(true)
    })

    it('should return true if passed a numeric string to 2 decimal places', function () {
      const result = validator.isCurrency(VALID_DECIMAL)
      expect(result).to.equal(true)
    })

    it('should return false if passed a non-numeric string', function () {
      const result = validator.isCurrency(INVALID_STRING)
      expect(result).to.equal(false)
    })
  })

  describe('isGreaterThanZero', function () {
    const VALID_NUMERIC = '20'
    const VALID_FLOAT = '7.99'
    const INVALID_NUMERIC = '-20'
    const INVALID_STRING = 'some invalid string'

    it('should return false if passed null', function () {
      const result = validator.isGreaterThanZero(null)
      expect(result).to.equal(false)
    })

    it('should return false if passed undefined', function () {
      const result = validator.isGreaterThanZero(undefined)
      expect(result).to.equal(false)
    })

    it('should return false if passed an object', function () {
      const result = validator.isGreaterThanZero({})
      expect(result).to.equal(false)
    })

    it('should return true if passed a numeric string that is greater than zero', function () {
      const result = validator.isGreaterThanZero(VALID_NUMERIC)
      expect(result).to.equal(true)
    })

    it('should return true if passed a float that is greater than zero', function () {
      const result = validator.isGreaterThanZero(VALID_FLOAT)
      expect(result).to.equal(true)
    })

    it('should return false if passed a negative numeric string', function () {
      const result = validator.isGreaterThanZero(INVALID_NUMERIC)
      expect(result).to.equal(false)
    })

    it('should return false if passed a non-numeric string', function () {
      const result = validator.isGreaterThanZero(INVALID_STRING)
      expect(result).to.equal(false)
    })
  })

  describe('isValidDateOfBirth', function () {
    const VALID_PAST_DATE = '1990-10-21'
    const INVALID_MONTH = '1990-21-10'
    const INVALID_YEAR = '21-10-1990'
    const INVALID_LENGTH = '1990-10-111'
    const FUTURE_DATE = '3000-10-21'
    const NON_NUMERIC_DATE = '1990-10-AS'

    it('should return false if passed null', function () {
      const result = validator.isValidDateOfBirth(null)
      expect(result).to.equal(false)
    })

    it('should return false if passed undefined', function () {
      const result = validator.isValidDateOfBirth(undefined)
      expect(result).to.equal(false)
    })

    it('should return false if passed an object', function () {
      const result = validator.isValidDateOfBirth({})
      expect(result).to.equal(false)
    })

    it('should return true if passed a valid past date', function () {
      const result = validator.isValidDateOfBirth(VALID_PAST_DATE)
      expect(result).to.equal(true)
    })

    it('should return false if passed an invalid month', function () {
      const result = validator.isValidDateOfBirth(INVALID_MONTH)
      expect(result).to.equal(false)
    })

    it('should return false if passed an invalid year', function () {
      const result = validator.isValidDateOfBirth(INVALID_YEAR)
      expect(result).to.equal(false)
    })

    it('should return false if passed an invalid length for day', function () {
      const result = validator.isValidDateOfBirth(INVALID_LENGTH)
      expect(result).to.equal(false)
    })

    it('should return false if passed a future date', function () {
      const result = validator.isValidDateOfBirth(FUTURE_DATE)
      expect(result).to.equal(false)
    })

    it('should return false if passed non-numeric values', function () {
      const result = validator.isValidDateOfBirth(NON_NUMERIC_DATE)
      expect(result).to.equal(false)
    })
  })

  describe('isValidPrisonerRelationship', function () {
    const VALID_INPUT = prisonerRelationshipsEnum.PARTNER.urlValue
    const INVALID_INPUT = 'some invalid input'

    it('should return false if passed null', function () {
      const result = validator.isValidPrisonerRelationship(null)
      expect(result).to.equal(false)
    })

    it('should return false if passed undefined', function () {
      const result = validator.isValidPrisonerRelationship(undefined)
      expect(result).to.equal(false)
    })

    it('should return false if passed an object', function () {
      const result = validator.isValidPrisonerRelationship({})
      expect(result).to.equal(false)
    })

    it('should return true if passed a valid prisoner relationship', function () {
      const result = validator.isValidPrisonerRelationship(VALID_INPUT)
      expect(result).to.equal(true)
    })

    it('should return false if passed an invalid prisoner relationship', function () {
      const result = validator.isValidPrisonerRelationship(INVALID_INPUT)
      expect(result).to.equal(false)
    })
  })

  describe('isValidBenefit', function () {
    const VALID_INPUT = benefitsEnum.INCOME_SUPPORT.urlValue
    const INVALID_INPUT = 'some invalid input'

    it('should return false if passed null', function () {
      const result = validator.isValidBenefit(null)
      expect(result).to.equal(false)
    })

    it('should return false if passed undefined', function () {
      const result = validator.isValidBenefit(undefined)
      expect(result).to.equal(false)
    })

    it('should return false if passed an object', function () {
      const result = validator.isValidBenefit({})
      expect(result).to.equal(false)
    })

    it('should return true if passed a valid benefit value', function () {
      const result = validator.isValidBenefit(VALID_INPUT)
      expect(result).to.equal(true)
    })

    it('should return false if passed an invalid benefit value', function () {
      const result = validator.isValidBenefit(INVALID_INPUT)
      expect(result).to.equal(false)
    })
  })

  describe('isValidReference', function () {
    const VALID_INPUT = '49CCADM'
    const INVALID_INPUT = 'some invalid input'

    it('should return false if passed null', function () {
      const result = validator.isValidReference(null)
      expect(result).to.equal(false)
    })

    it('should return false if passed undefined', function () {
      const result = validator.isValidReference(undefined)
      expect(result).to.equal(false)
    })

    it('should throw Error if passed an object', function () {
      expect(function () {
        validator.isValidReference({})
      }).to.throw(TypeError)
    })

    it('should return true if passed a valid reference value', function () {
      const result = validator.isValidReference(VALID_INPUT)
      expect(result).to.equal(true)
    })

    it('should return false if passed an invalid reference value', function () {
      const result = validator.isValidReference(INVALID_INPUT)
      expect(result).to.equal(false)
    })
  })

  describe('isValidReferenceId', function () {
    const VALID_INPUT = '49CCADM-1234'
    const INVALID_INPUT = '49CCADM321321dsadad'

    it('should return false if passed null', function () {
      const result = validator.isValidReferenceId(null)
      expect(result).to.equal(false)
    })

    it('should return false if passed undefined', function () {
      const result = validator.isValidReferenceId(undefined)
      expect(result).to.equal(false)
    })

    it('should throw Error if passed an object', function () {
      expect(function () {
        validator.isValidReference({})
      }).to.throw(TypeError)
    })

    it('should return true if passed a valid referenceId value', function () {
      const result = validator.isValidReferenceId(VALID_INPUT)
      expect(result).to.equal(true)
    })

    it('should return false if passed an invalid referenceId value', function () {
      const result = validator.isValidReferenceId(INVALID_INPUT)
      expect(result).to.equal(false)
    })
  })

  describe('isValidChildRelationship', function () {
    const VALID_INPUT = childRelationshipEnum.PRISONER_CHILD
    const INVALID_INPUT = 'some invalid input'

    it('should return false if passed null', function () {
      const result = validator.isValidChildRelationship(null)
      expect(result).to.equal(false)
    })

    it('should return false if passed undefined', function () {
      const result = validator.isValidChildRelationship(undefined)
      expect(result).to.equal(false)
    })

    it('should throw Error if passed an object', function () {
      const result = validator.isValidChildRelationship({})
      expect(result).to.equal(false)
    })

    it('should return true if passed a valid child relationship value', function () {
      const result = validator.isValidChildRelationship(VALID_INPUT)
      expect(result).to.equal(true)
    })

    it('should return false if passed an invalid child relationship value', function () {
      const result = validator.isValidChildRelationship(INVALID_INPUT)
      expect(result).to.equal(false)
    })
  })

  describe('isValidBooleanSelect', function () {
    const VALID_INPUT = booleanSelectEnum.YES
    const INVALID_INPUT = 'some invalid input'

    it('should return false if passed null', function () {
      const result = validator.isValidBooleanSelect(null)
      expect(result).to.equal(false)
    })

    it('should return false if passed undefined', function () {
      const result = validator.isValidBooleanSelect(undefined)
      expect(result).to.equal(false)
    })

    it('should throw Error if passed an object', function () {
      const result = validator.isValidBooleanSelect({})
      expect(result).to.equal(false)
    })

    it('should return true if passed a valid value', function () {
      const result = validator.isValidBooleanSelect(VALID_INPUT)
      expect(result).to.equal(true)
    })

    it('should return false if passed an invalid value', function () {
      const result = validator.isValidBooleanSelect(INVALID_INPUT)
      expect(result).to.equal(false)
    })
  })

  describe('isValidClaimType', function () {
    const VALID_INPUT = claimTypeEnum.FIRST_TIME
    const INVALID_INPUT = 'some invalid input'

    it('should return false if passed null', function () {
      const result = validator.isValidClaimType(null)
      expect(result).to.equal(false)
    })

    it('should return false if passed undefined', function () {
      const result = validator.isValidClaimType(undefined)
      expect(result).to.equal(false)
    })

    it('should throw Error if passed an object', function () {
      const result = validator.isValidClaimType({})
      expect(result).to.equal(false)
    })

    it('should return true if passed a valid value', function () {
      const result = validator.isValidClaimType(VALID_INPUT)
      expect(result).to.equal(true)
    })

    it('should return false if passed an invalid value', function () {
      const result = validator.isValidClaimType(INVALID_INPUT)
      expect(result).to.equal(false)
    })
  })

  describe('isValidExpense', function () {
    const VALID_INPUT = expenseTypeEnum.PLANE.value
    const INVALID_INPUT = 'some invalid input'

    it('should return false if passed null', function () {
      const result = validator.isValidExpense(null)
      expect(result).to.equal(false)
    })

    it('should return false if passed undefined', function () {
      const result = validator.isValidExpense(undefined)
      expect(result).to.equal(false)
    })

    it('should throw Error if passed an object', function () {
      const result = validator.isValidExpense({})
      expect(result).to.equal(false)
    })

    it('should return true if passed a valid value', function () {
      const result = validator.isValidExpense(VALID_INPUT)
      expect(result).to.equal(true)
    })

    it('should return false if passed an invalid value', function () {
      const result = validator.isValidExpense(INVALID_INPUT)
      expect(result).to.equal(false)
    })
  })

  describe('isValidExpenseArray', function () {
    const VALID_ARRAY_INPUT = [expenseTypeEnum.PLANE.value, expenseTypeEnum.LIGHT_REFRESHMENT.value]
    const VALID_STRING_INPUT = expenseTypeEnum.PLANE.value

    const INVALID_ARRAY_INPUT = ['some invalid input', expenseTypeEnum.ACCOMMODATION.value]
    const INVALID_STRING_INPUT = 'some invalid input'

    it('should return false if passed null', function () {
      const result = validator.isValidExpenseArray(null)
      expect(result).to.equal(false)
    })

    it('should return false if passed undefined', function () {
      const result = validator.isValidExpenseArray(undefined)
      expect(result).to.equal(false)
    })

    it('should throw Error if passed an object', function () {
      const result = validator.isValidExpenseArray({})
      expect(result).to.equal(false)
    })

    it('should return true if passed all valid values', function () {
      const result = validator.isValidExpenseArray(VALID_ARRAY_INPUT)
      expect(result).to.equal(true)
    })

    it('should return true if passed a valid value', function () {
      const result = validator.isValidExpenseArray(VALID_STRING_INPUT)
      expect(result).to.equal(true)
    })

    it('should return false if passed any invalid values', function () {
      const result = validator.isValidExpenseArray(INVALID_ARRAY_INPUT)
      expect(result).to.equal(false)
    })

    it('should return false if passed an invalid value', function () {
      const result = validator.isValidExpenseArray(INVALID_STRING_INPUT)
      expect(result).to.equal(false)
    })
  })

  describe('isValidAdvanceOrPast', function () {
    const VALID_INPUT = advancePastEnum.PAST
    const INVALID_INPUT = 'some invalid input'

    it('should return false if passed null', function () {
      const result = validator.isValidAdvanceOrPast(null)
      expect(result).to.equal(false)
    })

    it('should return false if passed undefined', function () {
      const result = validator.isValidAdvanceOrPast(undefined)
      expect(result).to.equal(false)
    })

    it('should throw Error if passed an object', function () {
      const result = validator.isValidAdvanceOrPast({})
      expect(result).to.equal(false)
    })

    it('should return true if passed a valid value', function () {
      const result = validator.isValidAdvanceOrPast(VALID_INPUT)
      expect(result).to.equal(true)
    })

    it('should return false if passed an invalid value', function () {
      const result = validator.isValidAdvanceOrPast(INVALID_INPUT)
      expect(result).to.equal(false)
    })
  })
})
