const FieldValidator = require('../../../../app/services/validators/field-validator')
const ErrorHandler = require('../../../../app/services/validators/error-handler')
const childRelationshipEnum = require('../../../../app/constants/child-relationship-enum')
const prisonerRelationshipEnum = require('../../../../app/constants/prisoner-relationships-enum')
const benefitsEnum = require('../../../../app/constants/benefits-enum')
const expensesEnum = require('../../../../app/constants/expense-type-enum')
const booleanSelectEnum = require('../../../../app/constants/boolean-select-enum')
const advancePastEnum = require('../../../../app/constants/advance-past-enum')
const ERROR_MESSAGES = require('../../../../app/services/validators/validation-error-messages')
const validationFieldNames = require('../../../../app/services/validators/validation-field-names')

describe('services/validators/field-validator', () => {
  const VALID_ALPHA = 'data'
  const VALID_NUMERIC = '1'
  const INVALID_DATA = ''
  const INVALID_FORMAT_DATA = 'AAAAAA1'
  const FIELD_NAME = 'FirstName'
  const DISPLAY_NAME = validationFieldNames[FIELD_NAME]
  const VALID_POSTCODE = 'BT123BT'
  const VALID_NATIONAL_INSURANCE_NUMBER = 'AA123456B'
  const VALID_EMAIL = 'test1@tester.com'
  const ERROR_HANDLER = ErrorHandler()

  describe('isRequired', () => {
    const INVALID_DATA_SELECT = 'select'

    it('should return an error object if passed null', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(null, FIELD_NAME, errorHandler).isRequired()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })

    it('should return an error object if passed undefined', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(undefined, FIELD_NAME, errorHandler).isRequired()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })

    it('should throw error if data is an object', () => {
      const errorHandler = ErrorHandler()
      FieldValidator({}, FIELD_NAME, errorHandler).isRequired()
      const errors = errorHandler.get()
      expect(errors).toBe(false)
    })

    it('should return false if passed valid data', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(VALID_ALPHA, FIELD_NAME, errorHandler).isRequired()
      const errors = errorHandler.get()
      expect(errors).toBe(false)
    })

    it('should return an error object if passed invalid data', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(INVALID_DATA, FIELD_NAME, errorHandler).isRequired()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })

    it('should return an error if passed invalid data with a specific message', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(null, FIELD_NAME, errorHandler).isRequired(ERROR_MESSAGES.getRadioQuestionIsRequired)
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
      expect(errors[FIELD_NAME]).toContain(ERROR_MESSAGES.getRadioQuestionIsRequired(DISPLAY_NAME))
    })

    it('should return an error if passed invalid data from a select input', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(INVALID_DATA_SELECT, FIELD_NAME, errorHandler).isRequired()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })
  })

  describe('isAlpha', () => {
    it('should throw error if data is null', () => {
      expect(() => {
        FieldValidator(null, FIELD_NAME, ERROR_HANDLER).isAlpha()
      }).toThrow(TypeError)
    })

    it('should throw error if data is undefined', () => {
      expect(() => {
        FieldValidator(undefined, FIELD_NAME, ERROR_HANDLER).isAlpha()
      }).toThrow(TypeError)
    })

    it('should throw error if data is an object', () => {
      expect(() => {
        FieldValidator({}, FIELD_NAME, ERROR_HANDLER).isAlpha()
      }).toThrow(TypeError)
    })

    it('should return false if passed valid data', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(VALID_ALPHA, FIELD_NAME, errorHandler).isAlpha()
      const errors = errorHandler.get()
      expect(errors).toBe(false)
    })

    it('should return an error object if passed invalid data', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(INVALID_DATA, FIELD_NAME, errorHandler).isAlpha()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })
  })

  describe('isNumeric', () => {
    it('should throw error if data is null', () => {
      expect(() => {
        FieldValidator(null, FIELD_NAME, ERROR_HANDLER).isNumeric()
      }).toThrow(TypeError)
    })

    it('should throw error if data is undefined', () => {
      expect(() => {
        FieldValidator(undefined, FIELD_NAME, ERROR_HANDLER).isNumeric()
      }).toThrow(TypeError)
    })

    it('should throw error if data is an object', () => {
      expect(() => {
        FieldValidator({}, FIELD_NAME, ERROR_HANDLER).isNumeric()
      }).toThrow(TypeError)
    })

    it('should return false if passed valid data', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(VALID_NUMERIC, FIELD_NAME, errorHandler).isNumeric()
      const errors = errorHandler.get()
      expect(errors).toBe(false)
    })

    it('should return an error object if passed invalid data', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(INVALID_DATA, FIELD_NAME, errorHandler).isNumeric()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })
  })

  describe('isLength', () => {
    const ACCEPTED_LENGTH = '2'
    const VALID_LENGTH = '11'
    const INVALID_LENGTH = '111'

    it('should throw error if data is null', () => {
      expect(() => {
        FieldValidator(null, FIELD_NAME, ERROR_HANDLER).isLength()
      }).toThrow(TypeError)
    })

    it('should throw error if data is undefined', () => {
      expect(() => {
        FieldValidator(undefined, FIELD_NAME, ERROR_HANDLER).isLength()
      }).toThrow(TypeError)
    })

    it('should throw error if data is an object', () => {
      expect(() => {
        FieldValidator({}, FIELD_NAME, ERROR_HANDLER).isLength()
      }).toThrow(TypeError)
    })

    it('should return false if passed valid data', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(VALID_LENGTH, FIELD_NAME, errorHandler).isLength(ACCEPTED_LENGTH)
      const errors = errorHandler.get()
      expect(errors).toBe(false)
    })

    it('should return an error object if passed invalid data', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(INVALID_LENGTH, FIELD_NAME, errorHandler).isLength(ACCEPTED_LENGTH)
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })

    it('should return an error if passed invalid data with a specific message', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(INVALID_LENGTH, FIELD_NAME, errorHandler).isLength(
        ACCEPTED_LENGTH,
        ERROR_MESSAGES.getIsLengthDigitsMessage,
      )
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
      expect(errors[FIELD_NAME]).toContain(
        ERROR_MESSAGES.getIsLengthDigitsMessage(DISPLAY_NAME, { length: ACCEPTED_LENGTH }),
      )
    })
  })

  describe('isNationalInsuranceNumber', () => {
    it('should throw error if data is null', () => {
      expect(() => {
        FieldValidator(null, FIELD_NAME, ERROR_HANDLER).isNationalInsuranceNumber()
      }).toThrow(TypeError)
    })

    it('should throw error if data is undefined', () => {
      expect(() => {
        FieldValidator(undefined, FIELD_NAME, ERROR_HANDLER).isNationalInsuranceNumber()
      }).toThrow(TypeError)
    })

    it('should throw error if data is an object', () => {
      expect(() => {
        FieldValidator({}, FIELD_NAME, ERROR_HANDLER).isNationalInsuranceNumber()
      }).toThrow(TypeError)
    })

    it('should return false if passed valid data', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(VALID_NATIONAL_INSURANCE_NUMBER, FIELD_NAME, errorHandler).isNationalInsuranceNumber()
      const errors = errorHandler.get()
      expect(errors).toBe(false)
    })

    it('should return an error object if passed invalid data', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(INVALID_FORMAT_DATA, FIELD_NAME, errorHandler).isNationalInsuranceNumber()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })
  })

  describe('isPostcode', () => {
    it('should throw error if data is null', () => {
      expect(() => {
        FieldValidator(null, FIELD_NAME, ERROR_HANDLER).isPostcode()
      }).toThrow(TypeError)
    })

    it('should throw error if data is undefined', () => {
      expect(() => {
        FieldValidator(undefined, FIELD_NAME, ERROR_HANDLER).isPostcode()
      }).toThrow(TypeError)
    })

    it('should throw error if data is an object', () => {
      expect(() => {
        FieldValidator({}, FIELD_NAME, ERROR_HANDLER).isPostcode()
      }).toThrow(TypeError)
    })

    it('should return false if passed valid data', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(VALID_POSTCODE, FIELD_NAME, errorHandler).isPostcode()
      const errors = errorHandler.get()
      expect(errors).toBe(false)
    })

    it('should return an error object if passed invalid data', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(INVALID_FORMAT_DATA, FIELD_NAME, errorHandler).isPostcode()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })
  })

  describe('isEmail', () => {
    it('should throw error if data is null', () => {
      expect(() => {
        FieldValidator(null, FIELD_NAME, ERROR_HANDLER).isEmail()
      }).toThrow(TypeError)
    })

    it('should throw error if data is undefined', () => {
      expect(() => {
        FieldValidator(undefined, FIELD_NAME, ERROR_HANDLER).isEmail()
      }).toThrow(TypeError)
    })

    it('should throw error if data is an object', () => {
      expect(() => {
        FieldValidator({}, FIELD_NAME, ERROR_HANDLER).isEmail()
      }).toThrow(TypeError)
    })

    it('should return false if passed valid data', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(VALID_EMAIL, FIELD_NAME, errorHandler).isEmail()
      const errors = errorHandler.get()
      expect(errors).toBe(false)
    })

    it('should return an error object if passed invalid data', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(INVALID_FORMAT_DATA, FIELD_NAME, errorHandler).isEmail()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })
  })

  describe('isRange', () => {
    const ACCEPTED_MIN = '2'
    const ACCEPTED_MAX = '5'
    const VALID_LENGTH = '11'
    const INVALID_LENGTH = '111111'

    it('should throw error if data is null', () => {
      expect(() => {
        FieldValidator(null, FIELD_NAME, ERROR_HANDLER).isRange()
      }).toThrow(TypeError)
    })

    it('should throw error if data is undefined', () => {
      expect(() => {
        FieldValidator(undefined, FIELD_NAME, ERROR_HANDLER).isRange()
      }).toThrow(TypeError)
    })

    it('should throw error if data is an object', () => {
      expect(() => {
        FieldValidator({}, FIELD_NAME, ERROR_HANDLER).isRange()
      }).toThrow(TypeError)
    })

    it('should return false if passed valid data', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(VALID_LENGTH, FIELD_NAME, errorHandler).isRange(ACCEPTED_MIN, ACCEPTED_MAX)
      const errors = errorHandler.get()
      expect(errors).toBe(false)
    })

    it('should return an error object if passed invalid data', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(INVALID_LENGTH, FIELD_NAME, errorHandler).isRange(ACCEPTED_MIN, ACCEPTED_MAX)
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })
  })

  describe('isLessThanLength', () => {
    const ACCEPTED_LENGTH = '10'
    const VALID_LENGTH = '11111'
    const INVALID_LENGTH = '111111111111111'

    it('should throw error if data is null', () => {
      expect(() => {
        FieldValidator(null, FIELD_NAME, ERROR_HANDLER).isLessThanLength()
      }).toThrow(TypeError)
    })

    it('should throw error if data is undefined', () => {
      expect(() => {
        FieldValidator(undefined, FIELD_NAME, ERROR_HANDLER).isLessThanLength()
      }).toThrow(TypeError)
    })

    it('should throw error if data is an object', () => {
      expect(() => {
        FieldValidator({}, FIELD_NAME, ERROR_HANDLER).isLessThanLength()
      }).toThrow(TypeError)
    })

    it('should return false if passed valid data', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(VALID_LENGTH, FIELD_NAME, errorHandler).isLessThanLength(ACCEPTED_LENGTH)
      const errors = errorHandler.get()
      expect(errors).toBe(false)
    })

    it('should return an error object if passed invalid data', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(INVALID_LENGTH, FIELD_NAME, errorHandler).isLessThanLength(ACCEPTED_LENGTH)
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })

    it('should return an error if passed invalid data with a specific message', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(INVALID_LENGTH, FIELD_NAME, errorHandler).isLessThanLength(
        ACCEPTED_LENGTH,
        ERROR_MESSAGES.getPrisonerNameLessThanLengthMessage,
      )
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
      expect(errors[FIELD_NAME]).toContain(
        ERROR_MESSAGES.getPrisonerNameLessThanLengthMessage(DISPLAY_NAME, { length: ACCEPTED_LENGTH }),
      )
    })
  })

  describe('isReference', () => {
    const VALID_REFERENCE = 'APVS123'
    const INVALID_REFERENCE = 'APVS1234'

    it('should return false if data is null', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(null, FIELD_NAME, errorHandler).isReference()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })

    it('should throw error if data is undefined', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(undefined, FIELD_NAME, errorHandler).isReference()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })

    it('should throw error if data is an object', () => {
      const errorHandler = ErrorHandler()
      expect(() => {
        FieldValidator({}, FIELD_NAME, errorHandler).isReference()
      }).toThrow(TypeError)
    })

    it('should return false if passed valid data', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(VALID_REFERENCE, FIELD_NAME, errorHandler).isReference()
      const errors = errorHandler.get()
      expect(errors).toBe(false)
    })

    it('should return an error object if passed invalid data', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(INVALID_REFERENCE, FIELD_NAME, errorHandler).isReference()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })
  })

  describe('isCurrency', () => {
    const VALID_INPUT = '20'
    const INVALID_INPUT = 'invalid'

    it('should throw error if data is null', () => {
      expect(() => {
        FieldValidator(null, FIELD_NAME, ERROR_HANDLER).isCurrency()
      }).toThrow(TypeError)
    })

    it('should throw error if data is undefined', () => {
      expect(() => {
        FieldValidator(undefined, FIELD_NAME, ERROR_HANDLER).isCurrency()
      }).toThrow(TypeError)
    })

    it('should throw error if data is an object', () => {
      expect(() => {
        FieldValidator({}, FIELD_NAME, ERROR_HANDLER).isCurrency()
      }).toThrow(TypeError)
    })

    it('should return false if passed valid data', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(VALID_INPUT, FIELD_NAME, errorHandler).isCurrency()
      const errors = errorHandler.get()
      expect(errors).toBe(false)
    })

    it('should return an error object if passed invalid data', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(INVALID_INPUT, FIELD_NAME, errorHandler).isCurrency()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })
  })

  describe('isGreaterThanZero', () => {
    const VALID_INPUT = '20'
    const INVALID_INPUT = '0'

    it('should return an error object if passed null', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(null, FIELD_NAME, errorHandler).isGreaterThanZero()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })

    it('should return an error object if passed undefined', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(undefined, FIELD_NAME, errorHandler).isGreaterThanZero()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })

    it('should return an error object if passed an object', () => {
      const errorHandler = ErrorHandler()
      FieldValidator({}, FIELD_NAME, errorHandler).isGreaterThanZero()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })

    it('should return false if passed a numeric value greater than zero', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(VALID_INPUT, FIELD_NAME, errorHandler).isGreaterThanZero()
      const errors = errorHandler.get()
      expect(errors).toBe(false)
    })

    it('should return an error object if passed a value less than or equal to zero', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(INVALID_INPUT, FIELD_NAME, errorHandler).isGreaterThanZero()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })
  })

  describe('isValidChildRelationship', () => {
    const VALID_INPUT = childRelationshipEnum.PRISONER_CHILD
    const INVALID_INPUT = 'some invalid input'

    it('should return an error object if passed null', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(null, FIELD_NAME, errorHandler).isValidChildRelationship()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })

    it('should return an error object if passed undefined', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(undefined, FIELD_NAME, errorHandler).isValidChildRelationship()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })

    it('should return an error object if passed an object', () => {
      const errorHandler = ErrorHandler()
      FieldValidator({}, FIELD_NAME, errorHandler).isValidChildRelationship()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })

    it('should return false if passed a valid child relationship value', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(VALID_INPUT, FIELD_NAME, errorHandler).isValidChildRelationship()
      const errors = errorHandler.get()
      expect(errors).toBe(false)
    })

    it('should return an error object if passed an invalid child relationship value', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(INVALID_INPUT, FIELD_NAME, errorHandler).isValidChildRelationship()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })
  })

  describe('isValidBooleanSelect', () => {
    const VALID_INPUT = booleanSelectEnum.YES
    const INVALID_INPUT = 'some invalid input'

    it('should return an error object if passed null', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(null, FIELD_NAME, errorHandler).isValidBooleanSelect()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })

    it('should return an error object if passed undefined', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(undefined, FIELD_NAME, errorHandler).isValidBooleanSelect()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })

    it('should return an error object if passed an object', () => {
      const errorHandler = ErrorHandler()
      FieldValidator({}, FIELD_NAME, errorHandler).isValidBooleanSelect()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })

    it('should return false if passed a valid value', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(VALID_INPUT, FIELD_NAME, errorHandler).isValidBooleanSelect()
      const errors = errorHandler.get()
      expect(errors).toBe(false)
    })

    it('should return an error object if passed an invalid value', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(INVALID_INPUT, FIELD_NAME, errorHandler).isValidBooleanSelect()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })
  })

  describe('isValidPrisonerRelationship', () => {
    const VALID_INPUT = prisonerRelationshipEnum.PARTNER.urlValue
    const INVALID_INPUT = 'some invalid input'

    it('should return an error object if passed null', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(null, FIELD_NAME, errorHandler).isValidPrisonerRelationship()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })

    it('should return an error object if passed undefined', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(undefined, FIELD_NAME, errorHandler).isValidPrisonerRelationship()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })

    it('should return an error object if passed an object', () => {
      const errorHandler = ErrorHandler()
      FieldValidator({}, FIELD_NAME, errorHandler).isValidPrisonerRelationship()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })

    it('should return false if passed a valid prisoner relationship value', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(VALID_INPUT, FIELD_NAME, errorHandler).isValidPrisonerRelationship()
      const errors = errorHandler.get()
      expect(errors).toBe(false)
    })

    it('should return an error object if passed an invalid prisoner relationship value', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(INVALID_INPUT, FIELD_NAME, errorHandler).isValidPrisonerRelationship()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })
  })

  describe('isValidBenefit', () => {
    const VALID_INPUT = benefitsEnum.INCOME_SUPPORT.urlValue
    const INVALID_INPUT = 'some invalid input'
    const NONE_OF_THE_ABOVE = 'none'

    it('should return an error object if passed null', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(null, FIELD_NAME, errorHandler).isValidBenefit()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })

    it('should return an error object if passed undefined', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(undefined, FIELD_NAME, errorHandler).isValidBenefit()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })

    it('should return an error object if passed an object', () => {
      const errorHandler = ErrorHandler()
      FieldValidator({}, FIELD_NAME, errorHandler).isValidBenefit()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })

    it('should return false if passed a valid benefits value', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(VALID_INPUT, FIELD_NAME, errorHandler).isValidBenefit()
      const errors = errorHandler.get()
      expect(errors).toBe(false)
    })

    it('should return false if passed none and fromDomain is true', () => {
      const errorHandler = ErrorHandler()
      const fromDomain = true
      FieldValidator(NONE_OF_THE_ABOVE, 'none', errorHandler).isValidBenefit(fromDomain)
      const errors = errorHandler.get()
      expect(errors).toBe(false)
    })

    it('should return not return an error object if passed none and fromDomain is false', () => {
      const errorHandler = ErrorHandler()
      const fromDomain = false
      FieldValidator(NONE_OF_THE_ABOVE, 'None', errorHandler).isValidBenefit(fromDomain)
      const errors = errorHandler.get()
      expect(errors).toBe(false)
    })

    it('should return an error object if passed an invalid benefits value', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(INVALID_INPUT, FIELD_NAME, errorHandler).isValidBenefit()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })
  })

  describe('isValidExpenseArray', () => {
    const VALID_INPUT = [expensesEnum.BUS.value, expensesEnum.PLANE.value]
    const INVALID_INPUT = ['some invalid input', expensesEnum.PLANE.value]

    it('should return an error object if passed null', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(null, FIELD_NAME, errorHandler).isValidExpenseArray()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })

    it('should return an error object if passed undefined', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(undefined, FIELD_NAME, errorHandler).isValidExpenseArray()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })

    it('should return an error object if passed an object', () => {
      const errorHandler = ErrorHandler()
      FieldValidator({}, FIELD_NAME, errorHandler).isValidExpenseArray()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })

    it('should return false if passed all valid expenses', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(VALID_INPUT, FIELD_NAME, errorHandler).isValidExpenseArray()
      const errors = errorHandler.get()
      expect(errors).toBe(false)
    })

    it('should return an error object if passed any invalid expenses', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(INVALID_INPUT, FIELD_NAME, errorHandler).isValidBenefit()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })
  })

  describe('isValidAdvanceOrPast', () => {
    const VALID_INPUT = advancePastEnum.PAST
    const INVALID_INPUT = 'some invalid input'

    it('should return an error object if passed null', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(null, FIELD_NAME, errorHandler).isValidAdvanceOrPast()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })

    it('should return an error object if passed undefined', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(undefined, FIELD_NAME, errorHandler).isValidAdvanceOrPast()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })

    it('should return an error object if passed an object', () => {
      const errorHandler = ErrorHandler()
      FieldValidator({}, FIELD_NAME, errorHandler).isValidAdvanceOrPast()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })

    it('should return false if passed a valid value', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(VALID_INPUT, FIELD_NAME, errorHandler).isValidAdvanceOrPast()
      const errors = errorHandler.get()
      expect(errors).toBe(false)
    })

    it('should return an error object if passed an invalid value', () => {
      const errorHandler = ErrorHandler()
      FieldValidator(INVALID_INPUT, FIELD_NAME, errorHandler).isValidAdvanceOrPast()
      const errors = errorHandler.get()
      expect(errors).toHaveProperty(FIELD_NAME)
    })
  })
})
