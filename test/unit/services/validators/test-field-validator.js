const expect = require('chai').expect
const FieldValidator = require('../../../../app/services/validators/field-validator')
const ErrorHandler = require('../../../../app/services/validators/error-handler')
const childRelationshipEnum = require('../../../../app/constants/child-relationship-enum')
const prisonerRelationshipEnum = require('../../../../app/constants/prisoner-relationships-enum')
const benefitsEnum = require('../../../../app/constants/benefits-enum')
const expensesEnum = require('../../../../app/constants/expense-type-enum')
const booleanSelectEnum = require('../../../../app/constants/boolean-select-enum')
const advancePastEnum = require('../../../../app/constants/advance-past-enum')

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

    it('should reach radio branch if radio is passed.', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(null, FIELD_NAME, errorHandler)
        .isRequired(QUESTION_TYPE)
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return an error object if passed null', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(null, FIELD_NAME, errorHandler)
        .isRequired()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return an error object if passed undefined', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(undefined, FIELD_NAME, errorHandler)
        .isRequired()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should throw error if data is an object', function () {
      var errorHandler = ErrorHandler()
      FieldValidator({}, FIELD_NAME, errorHandler)
        .isRequired()
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
    })

    it('should return false if passed valid data', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(VALID_ALPHA, FIELD_NAME, errorHandler)
        .isRequired()
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
    })

    it('should return an error object if passed invalid data', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(INVALID_DATA, FIELD_NAME, errorHandler)
        .isRequired()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })
  })

  describe('isAlpha', function () {
    it('should throw error if data is null', function () {
      expect(function () {
        FieldValidator(null, FIELD_NAME, ERROR_HANDLER)
          .isAlpha()
      }).to.throw(TypeError)
    })

    it('should throw error if data is undefined', function () {
      expect(function () {
        FieldValidator(undefined, FIELD_NAME, ERROR_HANDLER)
          .isAlpha()
      }).to.throw(TypeError)
    })

    it('should throw error if data is an object', function () {
      expect(function () {
        FieldValidator({}, FIELD_NAME, ERROR_HANDLER)
          .isAlpha()
      }).to.throw(TypeError)
    })

    it('should return false if passed valid data', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(VALID_ALPHA, FIELD_NAME, errorHandler)
        .isAlpha()
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
    })

    it('should return an error object if passed invalid data', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(INVALID_DATA, FIELD_NAME, errorHandler)
        .isAlpha()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })
  })

  describe('isNumeric', function () {
    it('should throw error if data is null', function () {
      expect(function () {
        FieldValidator(null, FIELD_NAME, ERROR_HANDLER)
          .isNumeric()
      }).to.throw(TypeError)
    })

    it('should throw error if data is undefined', function () {
      expect(function () {
        FieldValidator(undefined, FIELD_NAME, ERROR_HANDLER)
          .isNumeric()
      }).to.throw(TypeError)
    })

    it('should throw error if data is an object', function () {
      expect(function () {
        FieldValidator({}, FIELD_NAME, ERROR_HANDLER)
          .isNumeric()
      }).to.throw(TypeError)
    })

    it('should return false if passed valid data', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(VALID_NUMERIC, FIELD_NAME, errorHandler)
        .isNumeric()
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
    })

    it('should return an error object if passed invalid data', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(INVALID_DATA, FIELD_NAME, errorHandler)
        .isNumeric()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })
  })

  describe('isLength', function () {
    const ACCEPTED_LENGTH = '2'
    const VALID_LENGTH = '11'
    const INVALID_LENGTH = '111'

    it('should throw error if data is null', function () {
      expect(function () {
        FieldValidator(null, FIELD_NAME, ERROR_HANDLER)
          .isLength()
      }).to.throw(TypeError)
    })

    it('should throw error if data is undefined', function () {
      expect(function () {
        FieldValidator(undefined, FIELD_NAME, ERROR_HANDLER)
          .isLength()
      }).to.throw(TypeError)
    })

    it('should throw error if data is an object', function () {
      expect(function () {
        FieldValidator({}, FIELD_NAME, ERROR_HANDLER)
          .isLength()
      }).to.throw(TypeError)
    })

    it('should return false if passed valid data', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(VALID_LENGTH, FIELD_NAME, errorHandler)
        .isLength(ACCEPTED_LENGTH)
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
    })

    it('should return an error object if passed invalid data', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(INVALID_LENGTH, FIELD_NAME, errorHandler)
        .isLength(ACCEPTED_LENGTH)
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })
  })

  describe('isNationalInsuranceNumber', function () {
    it('should throw error if data is null', function () {
      expect(function () {
        FieldValidator(null, FIELD_NAME, ERROR_HANDLER)
          .isNationalInsuranceNumber()
      }).to.throw(TypeError)
    })

    it('should throw error if data is undefined', function () {
      expect(function () {
        FieldValidator(undefined, FIELD_NAME, ERROR_HANDLER)
          .isNationalInsuranceNumber()
      }).to.throw(TypeError)
    })

    it('should throw error if data is an object', function () {
      expect(function () {
        FieldValidator({}, FIELD_NAME, ERROR_HANDLER)
          .isNationalInsuranceNumber()
      }).to.throw(TypeError)
    })

    it('should return false if passed valid data', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(VALID_NATIONAL_INSURANCE_NUMBER, FIELD_NAME, errorHandler)
        .isNationalInsuranceNumber()
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
    })

    it('should return an error object if passed invalid data', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(INVALID_FORMAT_DATA, FIELD_NAME, errorHandler)
        .isNationalInsuranceNumber()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })
  })

  describe('isPostcode', function () {
    it('should throw error if data is null', function () {
      expect(function () {
        FieldValidator(null, FIELD_NAME, ERROR_HANDLER)
          .isPostcode()
      }).to.throw(TypeError)
    })

    it('should throw error if data is undefined', function () {
      expect(function () {
        FieldValidator(undefined, FIELD_NAME, ERROR_HANDLER)
          .isPostcode()
      }).to.throw(TypeError)
    })

    it('should throw error if data is an object', function () {
      expect(function () {
        FieldValidator({}, FIELD_NAME, ERROR_HANDLER)
          .isPostcode()
      }).to.throw(TypeError)
    })

    it('should return false if passed valid data', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(VALID_POSTCODE, FIELD_NAME, errorHandler)
        .isPostcode()
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
    })

    it('should return an error object if passed invalid data', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(INVALID_FORMAT_DATA, FIELD_NAME, errorHandler)
        .isPostcode()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })
  })

  describe('isEmail', function () {
    it('should throw error if data is null', function () {
      expect(function () {
        FieldValidator(null, FIELD_NAME, ERROR_HANDLER)
          .isEmail()
      }).to.throw(TypeError)
    })

    it('should throw error if data is undefined', function () {
      expect(function () {
        FieldValidator(undefined, FIELD_NAME, ERROR_HANDLER)
          .isEmail()
      }).to.throw(TypeError)
    })

    it('should throw error if data is an object', function () {
      expect(function () {
        FieldValidator({}, FIELD_NAME, ERROR_HANDLER)
          .isEmail()
      }).to.throw(TypeError)
    })

    it('should return false if passed valid data', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(VALID_EMAIL, FIELD_NAME, errorHandler)
        .isEmail()
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
    })

    it('should return an error object if passed invalid data', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(INVALID_FORMAT_DATA, FIELD_NAME, errorHandler)
        .isEmail()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })
  })

  describe('isRange', function () {
    const ACCEPTED_MIN = '2'
    const ACCEPTED_MAX = '5'
    const VALID_LENGTH = '11'
    const INVALID_LENGTH = '111111'

    it('should throw error if data is null', function () {
      expect(function () {
        FieldValidator(null, FIELD_NAME, ERROR_HANDLER)
          .isRange()
      }).to.throw(TypeError)
    })

    it('should throw error if data is undefined', function () {
      expect(function () {
        FieldValidator(undefined, FIELD_NAME, ERROR_HANDLER)
          .isRange()
      }).to.throw(TypeError)
    })

    it('should throw error if data is an object', function () {
      expect(function () {
        FieldValidator({}, FIELD_NAME, ERROR_HANDLER)
          .isRange()
      }).to.throw(TypeError)
    })

    it('should return false if passed valid data', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(VALID_LENGTH, FIELD_NAME, errorHandler)
        .isRange(ACCEPTED_MIN, ACCEPTED_MAX)
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
    })

    it('should return an error object if passed invalid data', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(INVALID_LENGTH, FIELD_NAME, errorHandler)
        .isRange(ACCEPTED_MIN, ACCEPTED_MAX)
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })
  })

  describe('isLessThanLength', function () {
    const ACCEPTED_LENGTH = '10'
    const VALID_LENGTH = '11111'
    const INVALID_LENGTH = '111111111111111'

    it('should throw error if data is null', function () {
      expect(function () {
        FieldValidator(null, FIELD_NAME, ERROR_HANDLER)
          .isLessThanLength()
      }).to.throw(TypeError)
    })

    it('should throw error if data is undefined', function () {
      expect(function () {
        FieldValidator(undefined, FIELD_NAME, ERROR_HANDLER)
          .isLessThanLength()
      }).to.throw(TypeError)
    })

    it('should throw error if data is an object', function () {
      expect(function () {
        FieldValidator({}, FIELD_NAME, ERROR_HANDLER)
          .isLessThanLength()
      }).to.throw(TypeError)
    })

    it('should return false if passed valid data', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(VALID_LENGTH, FIELD_NAME, errorHandler)
        .isLessThanLength(ACCEPTED_LENGTH)
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
    })

    it('should return an error object if passed invalid data', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(INVALID_LENGTH, FIELD_NAME, errorHandler)
        .isLessThanLength(ACCEPTED_LENGTH)
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })
  })

  describe('isReference', function () {
    const VALID_REFERENCE = 'APVS123'
    const INVALID_REFERENCE = 'APVS1234'

    it('should return false if data is null', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(null, FIELD_NAME, errorHandler)
        .isReference()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should throw error if data is undefined', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(undefined, FIELD_NAME, errorHandler)
        .isReference()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should throw error if data is an object', function () {
      var errorHandler = ErrorHandler()
      expect(function () {
        FieldValidator({}, FIELD_NAME, errorHandler)
          .isReference()
      }).to.throw(TypeError)
    })

    it('should return false if passed valid data', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(VALID_REFERENCE, FIELD_NAME, errorHandler)
        .isReference()
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
    })

    it('should return an error object if passed invalid data', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(INVALID_REFERENCE, FIELD_NAME, errorHandler)
        .isReference()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })
  })

  describe('isCurrency', function () {
    const VALID_INPUT = '20'
    const INVALID_INPUT = 'invalid'

    it('should throw error if data is null', function () {
      expect(function () {
        FieldValidator(null, FIELD_NAME, ERROR_HANDLER)
          .isCurrency()
      }).to.throw(TypeError)
    })

    it('should throw error if data is undefined', function () {
      expect(function () {
        FieldValidator(undefined, FIELD_NAME, ERROR_HANDLER)
          .isCurrency()
      }).to.throw(TypeError)
    })

    it('should throw error if data is an object', function () {
      expect(function () {
        FieldValidator({}, FIELD_NAME, ERROR_HANDLER)
          .isCurrency()
      }).to.throw(TypeError)
    })

    it('should return false if passed valid data', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(VALID_INPUT, FIELD_NAME, errorHandler)
        .isCurrency()
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
    })

    it('should return an error object if passed invalid data', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(INVALID_INPUT, FIELD_NAME, errorHandler)
        .isCurrency()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })
  })

  describe('isGreaterThanZero', function () {
    const VALID_INPUT = '20'
    const INVALID_INPUT = '0'

    it('should return an error object if passed null', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(null, FIELD_NAME, errorHandler)
        .isGreaterThanZero()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return an error object if passed undefined', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(undefined, FIELD_NAME, errorHandler)
        .isGreaterThanZero()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return an error object if passed an object', function () {
      var errorHandler = ErrorHandler()
      FieldValidator({}, FIELD_NAME, errorHandler)
        .isGreaterThanZero()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return false if passed a numeric value greater than zero', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(VALID_INPUT, FIELD_NAME, errorHandler)
        .isGreaterThanZero()
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
    })

    it('should return an error object if passed a value less than or equal to zero', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(INVALID_INPUT, FIELD_NAME, errorHandler)
        .isGreaterThanZero()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })
  })

  describe('isValidChildRelationship', function () {
    const VALID_INPUT = childRelationshipEnum.PRISONER_CHILD
    const INVALID_INPUT = 'some invalid input'

    it('should return an error object if passed null', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(null, FIELD_NAME, errorHandler)
        .isValidChildRelationship()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return an error object if passed undefined', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(undefined, FIELD_NAME, errorHandler)
        .isValidChildRelationship()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return an error object if passed an object', function () {
      var errorHandler = ErrorHandler()
      FieldValidator({}, FIELD_NAME, errorHandler)
        .isValidChildRelationship()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return false if passed a valid child relationship value', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(VALID_INPUT, FIELD_NAME, errorHandler)
        .isValidChildRelationship()
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
    })

    it('should return an error object if passed an invalid child relationship value', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(INVALID_INPUT, FIELD_NAME, errorHandler)
        .isValidChildRelationship()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })
  })

  describe('isValidBooleanSelect', function () {
    const VALID_INPUT = booleanSelectEnum.YES
    const INVALID_INPUT = 'some invalid input'

    it('should return an error object if passed null', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(null, FIELD_NAME, errorHandler)
        .isValidBooleanSelect()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return an error object if passed undefined', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(undefined, FIELD_NAME, errorHandler)
        .isValidBooleanSelect()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return an error object if passed an object', function () {
      var errorHandler = ErrorHandler()
      FieldValidator({}, FIELD_NAME, errorHandler)
        .isValidBooleanSelect()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return false if passed a valid value', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(VALID_INPUT, FIELD_NAME, errorHandler)
        .isValidBooleanSelect()
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
    })

    it('should return an error object if passed an invalid value', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(INVALID_INPUT, FIELD_NAME, errorHandler)
        .isValidBooleanSelect()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })
  })

  describe('isValidPrisonerRelationship', function () {
    const VALID_INPUT = prisonerRelationshipEnum.PARTNER.value
    const INVALID_INPUT = 'some invalid input'

    it('should return an error object if passed null', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(null, FIELD_NAME, errorHandler)
        .isValidPrisonerRelationship()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return an error object if passed undefined', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(undefined, FIELD_NAME, errorHandler)
        .isValidPrisonerRelationship()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return an error object if passed an object', function () {
      var errorHandler = ErrorHandler()
      FieldValidator({}, FIELD_NAME, errorHandler)
        .isValidPrisonerRelationship()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return false if passed a valid prisoner relationship value', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(VALID_INPUT, FIELD_NAME, errorHandler)
        .isValidPrisonerRelationship()
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
    })

    it('should return an error object if passed an invalid prisoner relationship value', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(INVALID_INPUT, FIELD_NAME, errorHandler)
        .isValidPrisonerRelationship()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })
  })

  describe('isValidBenefit', function () {
    const VALID_INPUT = benefitsEnum.INCOME_SUPPORT.value
    const INVALID_INPUT = 'some invalid input'
    const NONE_OF_THE_ABOVE = 'none'

    it('should return an error object if passed null', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(null, FIELD_NAME, errorHandler)
        .isValidBenefit()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return an error object if passed undefined', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(undefined, FIELD_NAME, errorHandler)
        .isValidBenefit()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return an error object if passed an object', function () {
      var errorHandler = ErrorHandler()
      FieldValidator({}, FIELD_NAME, errorHandler)
        .isValidBenefit()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return false if passed a valid benefits value', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(VALID_INPUT, FIELD_NAME, errorHandler)
        .isValidBenefit()
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
    })

    it('should return false if passed none and fromDomain is true', function () {
      var errorHandler = ErrorHandler()
      var fromDomain = true
      FieldValidator(NONE_OF_THE_ABOVE, 'none', errorHandler)
        .isValidBenefit(fromDomain)
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
    })

    it('should return an error object if passed none and fromDomain is false', function () {
      var errorHandler = ErrorHandler()
      var fromDomain = false
      FieldValidator(NONE_OF_THE_ABOVE, FIELD_NAME, errorHandler)
        .isValidBenefit(fromDomain)
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return an error object if passed an invalid benefits value', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(INVALID_INPUT, FIELD_NAME, errorHandler)
        .isValidBenefit()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })
  })

  describe('isValidExpenseArray', function () {
    const VALID_INPUT = [ expensesEnum.BUS.value, expensesEnum.PLANE.value ]
    const INVALID_INPUT = [ 'some invalid input', expensesEnum.PLANE.value ]

    it('should return an error object if passed null', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(null, FIELD_NAME, errorHandler)
        .isValidExpenseArray()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return an error object if passed undefined', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(undefined, FIELD_NAME, errorHandler)
        .isValidExpenseArray()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return an error object if passed an object', function () {
      var errorHandler = ErrorHandler()
      FieldValidator({}, FIELD_NAME, errorHandler)
        .isValidExpenseArray()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return false if passed all valid expenses', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(VALID_INPUT, FIELD_NAME, errorHandler)
        .isValidExpenseArray()
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
    })

    it('should return an error object if passed any invalid expenses', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(INVALID_INPUT, FIELD_NAME, errorHandler)
        .isValidBenefit()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })
  })

  describe('isValidAdvanceOrPast', function () {
    const VALID_INPUT = advancePastEnum.PAST
    const INVALID_INPUT = 'some invalid input'

    it('should return an error object if passed null', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(null, FIELD_NAME, errorHandler)
        .isValidAdvanceOrPast()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return an error object if passed undefined', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(undefined, FIELD_NAME, errorHandler)
        .isValidAdvanceOrPast()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return an error object if passed an object', function () {
      var errorHandler = ErrorHandler()
      FieldValidator({}, FIELD_NAME, errorHandler)
        .isValidAdvanceOrPast()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return false if passed a valid value', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(VALID_INPUT, FIELD_NAME, errorHandler)
        .isValidAdvanceOrPast()
      var errors = errorHandler.get()
      expect(errors).to.equal(false)
    })

    it('should return an error object if passed an invalid value', function () {
      var errorHandler = ErrorHandler()
      FieldValidator(INVALID_INPUT, FIELD_NAME, errorHandler)
        .isValidAdvanceOrPast()
      var errors = errorHandler.get()
      expect(errors).to.have.property(FIELD_NAME)
    })
  })
})
