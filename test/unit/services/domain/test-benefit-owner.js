/* eslint-disable no-new */
const ValidationError = require('../../../../app/services/errors/validation-error')
const BenefitOwner = require('../../../../app/services/domain/benefit-owner')

let benefitOwner

describe('services/domain/benefit-owner', function () {
  const VALID_FIRST_NAME = 'Joe '
  const VALID_LAST_NAME = ' Bloggs'
  const VALID_DOB_DAY = '01'
  const VALID_DOB_MONTH = '01'
  const VALID_DOB_YEAR = '1995'
  const VALID_NATIONAL_INSURANCE_NUMBER = 'aA 123456B'

  const INVALID_CHARS_FIRST_NAME = 'Joe>&lt><&gt'
  const INVALID_CHARS_LAST_NAME = '<Bloggs>'
  const INVALID_DOB_DAY = '99'
  const INVALID_DOB_MONTH = '15'
  const INVALID_NATIONAL_INSURANCE_NUMBER = '123456'

  const REQUIRED_FIELDS = ['FirstName', 'LastName', 'NationalInsuranceNumber', 'dob']

  it('should construct a domain object given valid input', function () {
    benefitOwner = new BenefitOwner(
      VALID_FIRST_NAME,
      VALID_LAST_NAME,
      VALID_DOB_DAY,
      VALID_DOB_MONTH,
      VALID_DOB_YEAR,
      VALID_NATIONAL_INSURANCE_NUMBER
    )

    expect(benefitOwner.firstName).toBe(VALID_FIRST_NAME.trim())
    expect(benefitOwner.lastName).toBe(VALID_LAST_NAME.trim())
    expect(benefitOwner.dobDay).toBe(VALID_DOB_DAY)
    expect(benefitOwner.dobMonth).toBe(VALID_DOB_MONTH)
    expect(benefitOwner.dobYear).toBe(VALID_DOB_YEAR)
    // should uppercase and remove whitespace
    expect(benefitOwner.nationalInsuranceNumber).toBe(VALID_NATIONAL_INSURANCE_NUMBER.replace(/ /g, '').toUpperCase())
  })

  it('should throw a ValidationError if given invalid input', function () {
    expect(function () {
      new BenefitOwner('', '', '', '', '', '', '', '', '', '', '', '', '')
    }).toThrow()
  })

  it('should return errors for all required fields', function () {
    try {
      new BenefitOwner('', '', '', '', '', '', '')
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)
      expect(Object.keys(error.validationErrors).sort()).toEqual(REQUIRED_FIELDS.sort())
    }
  })

  it('should throw a ValidationError if an invalid National Insurance Number is provided as input', function () {
    expect(function () {
      benefitOwner = new BenefitOwner(
        VALID_FIRST_NAME,
        VALID_LAST_NAME,
        VALID_DOB_DAY,
        VALID_DOB_MONTH,
        VALID_DOB_YEAR,
        INVALID_NATIONAL_INSURANCE_NUMBER
      )
    }).toThrow()
  })

  it('should throw a ValidationError if an invalid DOB day is provided as input', function () {
    expect(function () {
      new BenefitOwner(
        VALID_FIRST_NAME,
        VALID_LAST_NAME,
        INVALID_DOB_DAY,
        VALID_DOB_MONTH,
        VALID_DOB_YEAR,
        VALID_NATIONAL_INSURANCE_NUMBER
      )
    }).toThrow()
  })

  it('should throw a ValidationError if an invalid DOB month is provided as input', function () {
    expect(function () {
      new BenefitOwner(
        VALID_FIRST_NAME,
        VALID_LAST_NAME,
        VALID_DOB_DAY,
        INVALID_DOB_MONTH,
        VALID_DOB_YEAR,
        VALID_NATIONAL_INSURANCE_NUMBER
      )
    }).toThrow()
  })

  it('should strip illegal characters from fields which accept free text inputs', function () {
    const unsafeInputPattern = />|<|&lt|&gt/g
    benefitOwner = new BenefitOwner(
      INVALID_CHARS_FIRST_NAME,
      INVALID_CHARS_LAST_NAME,
      VALID_DOB_DAY,
      VALID_DOB_MONTH,
      VALID_DOB_YEAR,
      VALID_NATIONAL_INSURANCE_NUMBER
    )

    expect(benefitOwner.firstName).toBe(INVALID_CHARS_FIRST_NAME.replace(unsafeInputPattern, ''))
    expect(benefitOwner.lastName).toBe(INVALID_CHARS_LAST_NAME.replace(unsafeInputPattern, ''))
    expect(benefitOwner.dobDay).toBe(VALID_DOB_DAY)
    expect(benefitOwner.dobMonth).toBe(VALID_DOB_MONTH)
    expect(benefitOwner.dobYear).toBe(VALID_DOB_YEAR)
    // should uppercase and remove whitespace
    expect(benefitOwner.nationalInsuranceNumber).toBe(VALID_NATIONAL_INSURANCE_NUMBER.replace(/ /g, '').toUpperCase())
  })
})
