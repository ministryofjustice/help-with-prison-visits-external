/* eslint-disable no-new */
const expect = require('chai').expect
const ValidationError = require('../../../../app/services/errors/validation-error')
const dateFormatter = require('../../../../app/services/date-formatter')
const AboutYou = require('../../../../app/services/domain/about-you')

var aboutYou

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

    expect(aboutYou.dob).to.deep.equal(dateFormatter.buildFromDateString(VALID_DOB))
    expect(aboutYou.relationship).to.equal(VALID_RELATIONSHIP)
    expect(aboutYou.benefit).to.equal(VALID_BENEFIT)
    expect(aboutYou.benefitOwner).to.equal(VALID_BENEFIT_OWNER)
    expect(aboutYou.firstName).to.equal(VALID_FIRST_NAME)
    expect(aboutYou.lastName).to.equal(VALID_LAST_NAME)
    expect(aboutYou.nationalInsuranceNumber, 'should uppercase and remove whitespace').to.equal(VALID_NATIONAL_INSURANCE_NUMBER.replace(/ /g, '').toUpperCase())
    expect(aboutYou.houseNumberAndStreet).to.equal(VALID_HOUSE_NUMBER_AND_STREET)
    expect(aboutYou.town).to.equal(VALID_TOWN)
    expect(aboutYou.county).to.equal(VALID_COUNTY)
    expect(aboutYou.postCode, 'should uppercase and remove whitespace').to.equal(VALID_POSTCODE.replace(/ /g, '').toUpperCase())
    expect(aboutYou.country).to.equal(VALID_COUNTRY)
    expect(aboutYou.emailAddress).to.equal(VALID_EMAIL_ADDRESS)
    expect(aboutYou.phoneNumber).to.equal(VALID_PHONE_NUMBER)
  })

  it('should throw a ValidationError if given invalid input', function () {
    expect(function () {
      new AboutYou('', '', '', '', '', '', '', '', '', '', '', '', '')
    }).to.throw(ValidationError)
  })

  it('should return errors for all required fields', function () {
    try {
      new AboutYou('', '', '', '', '', '', '')
    } catch (error) {
      expect(error).to.be.instanceof(ValidationError)
      expect(error.validationErrors).to.have.all.keys(REQUIRED_FIELDS)
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
    }).to.throw(ValidationError)
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
    }).to.throw(ValidationError)
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
    }).to.throw(ValidationError)
  })

  it('should strip illegal characters from fields which accept free text inputs', function () {
    const unsafeInputPattern = new RegExp(/>|<|&lt|&gt/g)
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

    expect(aboutYou.dob).to.deep.equal(dateFormatter.buildFromDateString(VALID_DOB))
    expect(aboutYou.relationship).to.equal(VALID_RELATIONSHIP)
    expect(aboutYou.benefit).to.equal(VALID_BENEFIT)
    expect(aboutYou.benefitOwner).to.equal(VALID_BENEFIT_OWNER)
    expect(aboutYou.firstName).to.equal(INVALID_CHARS_FIRST_NAME.replace(unsafeInputPattern, ''))
    expect(aboutYou.lastName).to.equal(INVALID_CHARS_LAST_NAME.replace(unsafeInputPattern, ''))
    expect(aboutYou.nationalInsuranceNumber, 'should uppercase and remove whitespace').to.equal(VALID_NATIONAL_INSURANCE_NUMBER.replace(/ /g, '').toUpperCase())
    expect(aboutYou.houseNumberAndStreet).to.equal(INVALID_CHARS_HOUSE_NUMBER_AND_STREET.replace(unsafeInputPattern, ''))
    expect(aboutYou.town).to.equal(INVALID_CHARS_TOWN.replace(unsafeInputPattern, ''))
    expect(aboutYou.county).to.equal(INVALID_CHARS_COUNTY.replace(unsafeInputPattern, ''))
    expect(aboutYou.postCode, 'should uppercase and remove whitespace').to.equal(VALID_POSTCODE.replace(/ /g, '').toUpperCase())
    expect(aboutYou.country).to.equal(INVALID_CHARS_COUNTRY.replace(unsafeInputPattern, ''))
    expect(aboutYou.emailAddress).to.equal(VALID_EMAIL_ADDRESS)
    expect(aboutYou.phoneNumber).to.equal(INVALID_CHARS_PHONE_NUMBER.replace(unsafeInputPattern, ''))
  })
})
