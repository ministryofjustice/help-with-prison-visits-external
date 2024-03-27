/* eslint-disable no-new */
const ValidationError = require('../../../../app/services/errors/validation-error')
const dateFormatter = require('../../../../app/services/date-formatter')
const AboutYou = require('../../../../app/services/domain/about-you')

let aboutYou

describe('services/domain/about-you', function () {
  const VALID_DOB = '1980-01-01'
  const VALID_RELATIONSHIP = 'partner'
  const VALID_BENEFIT = 'income-support'
  const VALID_BENEFIT_OWNER = 'yes'
  const VALID_FIRST_NAME = 'Tester'
  const VALID_LAST_NAME = 'Test'
  const VALID_NATIONAL_INSURANCE_NUMBER = 'aA 123456B'
  const VALID_HOUSE_NUMBER_AND_STREET = 'Test Street'
  const VALID_TOWN = 'Testing Town'
  const VALID_COUNTY = 'Test'
  const VALID_POSTCODE = 'bt12 3bt'
  const VALID_COUNTRY = 'Northern Ireland'
  const VALID_EMAIL_ADDRESS = 'test1@tester.com'
  const VALID_PHONE_NUMBER = '555 555 555'

  const INVALID_CHARS_FIRST_NAME = 'Tester<&lt>>'
  const INVALID_CHARS_LAST_NAME = 'Tesgtt<&gt'
  const INVALID_CHARS_HOUSE_NUMBER_AND_STREET = '<Test Street>'
  const INVALID_CHARS_TOWN = 'Testing<Town>'
  const INVALID_CHARS_COUNTY = 'Tes>t&lt'
  const INVALID_CHARS_COUNTRY = 'Northernlt <Ireland>'
  const INVALID_CHARS_PHONE_NUMBER = '028&lgscript&gt12345>'
  const INVALID_NATIONAL_INSURANCE_NUMBER = '123456'
  const INVALID_POST_CODE = '123456'
  const INVALID_EMAIL_ADDRESS = '1234'

  const REQUIRED_FIELDS = ['FirstName', 'LastName', 'NationalInsuranceNumber', 'HouseNumberAndStreet', 'Town', 'County', 'PostCode', 'Country', 'EmailAddress']

  it('should construct a domain object given valid input', function () {
    aboutYou = new AboutYou(
      VALID_DOB,
      VALID_RELATIONSHIP,
      VALID_BENEFIT,
      VALID_BENEFIT_OWNER,
      VALID_FIRST_NAME,
      VALID_LAST_NAME,
      VALID_NATIONAL_INSURANCE_NUMBER,
      VALID_HOUSE_NUMBER_AND_STREET,
      VALID_TOWN,
      VALID_COUNTY,
      VALID_POSTCODE,
      VALID_COUNTRY,
      VALID_EMAIL_ADDRESS,
      VALID_PHONE_NUMBER
    )

    expect(aboutYou.dob).toEqual(dateFormatter.buildFromDateString(VALID_DOB))
    expect(aboutYou.relationship).toBe(VALID_RELATIONSHIP)
    expect(aboutYou.benefit).toBe(VALID_BENEFIT)
    expect(aboutYou.benefitOwner).toBe(VALID_BENEFIT_OWNER)
    expect(aboutYou.firstName).toBe(VALID_FIRST_NAME)
    expect(aboutYou.lastName).toBe(VALID_LAST_NAME)
    // should uppercase and remove whitespace
    expect(aboutYou.nationalInsuranceNumber).toBe(VALID_NATIONAL_INSURANCE_NUMBER.replace(/ /g, '').toUpperCase())
    expect(aboutYou.houseNumberAndStreet).toBe(VALID_HOUSE_NUMBER_AND_STREET)
    expect(aboutYou.town).toBe(VALID_TOWN)
    expect(aboutYou.county).toBe(VALID_COUNTY)
    // should uppercase and remove whitespace
    expect(aboutYou.postCode).toBe(VALID_POSTCODE.replace(/ /g, '').toUpperCase())
    expect(aboutYou.country).toBe(VALID_COUNTRY)
    expect(aboutYou.emailAddress).toBe(VALID_EMAIL_ADDRESS)
    expect(aboutYou.phoneNumber).toBe(VALID_PHONE_NUMBER)
  })

  it('should throw a ValidationError if given invalid input', function () {
    expect(function () {
      new AboutYou('', '', '', '', '', '', '', '', '', '', '', '', '')
    }).toThrow()
  })

  it('should return errors for all required fields', function () {
    try {
      new AboutYou('', '', '', '', '', '', '')
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)
      expect(Object.keys(error.validationErrors)).toContain(REQUIRED_FIELDS)
    }
  })

  it('should throw a ValidationError if an invalid National Insurance Number is provided as input', function () {
    expect(function () {
      aboutYou = new AboutYou(
        VALID_DOB,
        VALID_RELATIONSHIP,
        VALID_BENEFIT,
        VALID_BENEFIT_OWNER,
        VALID_FIRST_NAME,
        VALID_LAST_NAME,
        INVALID_NATIONAL_INSURANCE_NUMBER,
        VALID_HOUSE_NUMBER_AND_STREET,
        VALID_TOWN,
        VALID_COUNTY,
        VALID_POSTCODE,
        VALID_COUNTRY,
        VALID_EMAIL_ADDRESS,
        VALID_PHONE_NUMBER
      )
    }).toThrow()
  })

  it('should throw a ValidationError if an invalid PostCode is provided as input', function () {
    expect(function () {
      new AboutYou(
        VALID_DOB,
        VALID_RELATIONSHIP,
        VALID_BENEFIT,
        VALID_BENEFIT_OWNER,
        VALID_FIRST_NAME,
        VALID_LAST_NAME,
        VALID_NATIONAL_INSURANCE_NUMBER,
        VALID_HOUSE_NUMBER_AND_STREET,
        VALID_TOWN,
        VALID_COUNTY,
        INVALID_POST_CODE,
        VALID_COUNTRY,
        VALID_EMAIL_ADDRESS,
        VALID_PHONE_NUMBER
      )
    }).toThrow()
  })

  it('should throw a ValidationError if an invalid email address is provided as input', function () {
    expect(function () {
      new AboutYou(
        VALID_DOB,
        VALID_RELATIONSHIP,
        VALID_BENEFIT,
        VALID_BENEFIT_OWNER,
        VALID_FIRST_NAME,
        VALID_LAST_NAME,
        VALID_NATIONAL_INSURANCE_NUMBER,
        VALID_HOUSE_NUMBER_AND_STREET,
        VALID_TOWN,
        VALID_COUNTY,
        VALID_POSTCODE,
        VALID_COUNTRY,
        INVALID_EMAIL_ADDRESS,
        VALID_PHONE_NUMBER
      )
    }).toThrow()
  })

  it('should strip illegal characters from fields which accept free text inputs', function () {
    const unsafeInputPattern = />|<|&lt|&gt/g
    aboutYou = new AboutYou(
      VALID_DOB,
      VALID_RELATIONSHIP,
      VALID_BENEFIT,
      VALID_BENEFIT_OWNER,
      INVALID_CHARS_FIRST_NAME,
      INVALID_CHARS_LAST_NAME,
      VALID_NATIONAL_INSURANCE_NUMBER,
      VALID_HOUSE_NUMBER_AND_STREET,
      INVALID_CHARS_TOWN,
      INVALID_CHARS_COUNTY,
      VALID_POSTCODE,
      INVALID_CHARS_COUNTRY,
      VALID_EMAIL_ADDRESS,
      INVALID_CHARS_PHONE_NUMBER
    )

    expect(aboutYou.dob).toEqual(dateFormatter.buildFromDateString(VALID_DOB))
    expect(aboutYou.relationship).toBe(VALID_RELATIONSHIP)
    expect(aboutYou.benefit).toBe(VALID_BENEFIT)
    expect(aboutYou.benefitOwner).toBe(VALID_BENEFIT_OWNER)
    expect(aboutYou.firstName).toBe(INVALID_CHARS_FIRST_NAME.replace(unsafeInputPattern, ''))
    expect(aboutYou.lastName).toBe(INVALID_CHARS_LAST_NAME.replace(unsafeInputPattern, ''))
    // should uppercase and remove whitespace
    expect(aboutYou.nationalInsuranceNumber).toBe(VALID_NATIONAL_INSURANCE_NUMBER.replace(/ /g, '').toUpperCase())
    expect(aboutYou.houseNumberAndStreet).toBe(INVALID_CHARS_HOUSE_NUMBER_AND_STREET.replace(unsafeInputPattern, ''))
    expect(aboutYou.town).toBe(INVALID_CHARS_TOWN.replace(unsafeInputPattern, ''))
    expect(aboutYou.county).toBe(INVALID_CHARS_COUNTY.replace(unsafeInputPattern, ''))
    // should uppercase and remove whitespace
    expect(aboutYou.postCode).toBe(VALID_POSTCODE.replace(/ /g, '').toUpperCase())
    expect(aboutYou.country).toBe(INVALID_CHARS_COUNTRY.replace(unsafeInputPattern, ''))
    expect(aboutYou.emailAddress).toBe(VALID_EMAIL_ADDRESS)
    expect(aboutYou.phoneNumber).toBe(INVALID_CHARS_PHONE_NUMBER.replace(unsafeInputPattern, ''))
  })
})
