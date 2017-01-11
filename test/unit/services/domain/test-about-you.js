const expect = require('chai').expect
const ValidationError = require('../../../../app/services/errors/validation-error')
const dateFormatter = require('../../../../app/services/date-formatter')

const AboutYou = require('../../../../app/services/domain/about-you')
var aboutYou

describe('services/domain/about-you', function () {
  const VALID_DOB = '1980-01-01'
  const VALID_RELATIONSHIP = 'partner'
  const VALID_BENEFIT = 'income-support'
  const VALID_FIRSTNAME = 'Tester'
  const VALID_LASTNAME = 'Test'
  const VALID_NATIONALINSURANCENUMBER = 'aA 123456B'
  const VALID_HOUSENUMBERANDSTREET = 'Test Street'
  const VALID_TOWN = 'Testing Town'
  const VALID_COUNTY = 'Test'
  const VALID_POSTCODE = 'bt12 3bt'
  const VALID_COUNTRY = 'Northern Ireland'
  const VALID_EMAILADDRESS = 'test1@tester.com'
  const VALID_PHONENUMBER = '555 555 555'

  const INVALID_DOB = ''
  const INVALID_RELATIONSHIP = ''
  const INVALID_BENEFIT = ''
  const INVALID_FIRSTNAME = ''
  const INVALID_LASTNAME = ''
  const INVALID_NATIONALINSURANCENUMBER = ''
  const INVALID_HOUSENUMBERANDSTREET = ''
  const INVALID_TOWN = ''
  const INVALID_COUNTY = ''
  const INVALID_POSTCODE = ''
  const INVALID_COUNTRY = ''
  const INVALID_EMAILADDRESS = ''
  const INVALID_PHONENUMBER = ''

  const INVALID_CHARS_FIRSTNAME = 'Tester<&lt>>'
  const INVALID_CHARS_LASTNAME = 'Tesgtt<&gt'
  const INVALID_CHARS_HOUSENUMBERANDSTREET = '<Test Street>'
  const INVALID_CHARS_TOWN = 'Testing<Town>'
  const INVALID_CHARS_COUNTY = 'Tes>t&lt'
  const INVALID_CHARS_COUNTRY = 'Northernlt <Ireland>'
  const INVALID_CHARS_PHONENUMBER = '028&lgscript&gt12345>'

  it('should construct a domain object given valid input', function (done) {
    aboutYou = new AboutYou(VALID_DOB,
      VALID_RELATIONSHIP,
      VALID_BENEFIT,
      VALID_FIRSTNAME,
      VALID_LASTNAME,
      VALID_NATIONALINSURANCENUMBER,
      VALID_HOUSENUMBERANDSTREET,
      VALID_TOWN,
      VALID_COUNTY,
      VALID_POSTCODE,
      VALID_COUNTRY,
      VALID_EMAILADDRESS,
      VALID_PHONENUMBER)

    expect(aboutYou.dob).to.deep.equal(dateFormatter.buildFromDateString(VALID_DOB))
    expect(aboutYou.relationship).to.equal(VALID_RELATIONSHIP)
    expect(aboutYou.benefit).to.equal(VALID_BENEFIT)
    expect(aboutYou.firstName).to.equal(VALID_FIRSTNAME)
    expect(aboutYou.lastName).to.equal(VALID_LASTNAME)
    expect(aboutYou.nationalInsuranceNumber, 'should uppercase and remove whitespace').to.equal(VALID_NATIONALINSURANCENUMBER.replace(/ /g, '').toUpperCase())
    expect(aboutYou.houseNumberAndStreet).to.equal(VALID_HOUSENUMBERANDSTREET)
    expect(aboutYou.town).to.equal(VALID_TOWN)
    expect(aboutYou.county).to.equal(VALID_COUNTY)
    expect(aboutYou.postCode, 'should uppercase and remove whitespace').to.equal(VALID_POSTCODE.replace(/ /g, '').toUpperCase())
    expect(aboutYou.country).to.equal(VALID_COUNTRY)
    expect(aboutYou.emailAddress).to.equal(VALID_EMAILADDRESS)
    expect(aboutYou.phoneNumber).to.equal(VALID_PHONENUMBER)

    done()
  })

  it('should return isRequired errors given empty strings', function (done) {
    const IS_REQUIRED = 'is required'

    try {
      aboutYou = new AboutYou(INVALID_DOB,
        INVALID_RELATIONSHIP,
        INVALID_BENEFIT,
        INVALID_FIRSTNAME,
        INVALID_LASTNAME,
        INVALID_NATIONALINSURANCENUMBER,
        INVALID_HOUSENUMBERANDSTREET,
        INVALID_TOWN,
        INVALID_COUNTY,
        INVALID_POSTCODE,
        INVALID_COUNTRY,
        INVALID_EMAILADDRESS,
        INVALID_PHONENUMBER)
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)

      expect(e.validationErrors['FirstName'][0]).to.contain(IS_REQUIRED)
      expect(e.validationErrors['LastName'][0]).to.contain(IS_REQUIRED)
      expect(e.validationErrors['NationalInsuranceNumber'][0]).to.contain(IS_REQUIRED)
      expect(e.validationErrors['HouseNumberAndStreet'][0]).to.contain(IS_REQUIRED)
      expect(e.validationErrors['Town'][0]).to.contain(IS_REQUIRED)
      expect(e.validationErrors['County'][0]).to.contain(IS_REQUIRED)
      expect(e.validationErrors['PostCode'][0]).to.contain(IS_REQUIRED)
      expect(e.validationErrors['Country'][0]).to.contain(IS_REQUIRED)
      expect(e.validationErrors['EmailAddress'][0]).to.contain(IS_REQUIRED)
    }
    done()
  })

  it('should return invalid National Insurance Number for invalid National Insurance Number', function (done) {
    try {
      aboutYou = new AboutYou(INVALID_DOB,
        INVALID_RELATIONSHIP,
        INVALID_BENEFIT,
        INVALID_FIRSTNAME,
        INVALID_LASTNAME,
        '123456',
        INVALID_HOUSENUMBERANDSTREET,
        INVALID_TOWN,
        INVALID_COUNTY,
        INVALID_POSTCODE,
        INVALID_COUNTRY,
        INVALID_EMAILADDRESS,
        INVALID_PHONENUMBER)
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)

      expect(e.validationErrors['NationalInsuranceNumber'][0]).to.equal('National insurance number must have valid format')
    }
    done()
  })

  it('should return invalid Post Code error for invalid PostCode', function (done) {
    try {
      aboutYou = new AboutYou(INVALID_DOB,
        INVALID_RELATIONSHIP,
        INVALID_BENEFIT,
        INVALID_FIRSTNAME,
        INVALID_LASTNAME,
        INVALID_NATIONALINSURANCENUMBER,
        INVALID_HOUSENUMBERANDSTREET,
        INVALID_TOWN,
        INVALID_COUNTY,
        '123456',
        INVALID_COUNTRY,
        INVALID_EMAILADDRESS,
        INVALID_PHONENUMBER)
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)

      expect(e.validationErrors['PostCode'][0]).to.equal('Postcode must have valid format')
    }
    done()
  })

  it('should return invalid email error for invalid emailAddress', function (done) {
    try {
      aboutYou = new AboutYou(INVALID_DOB,
        INVALID_RELATIONSHIP,
        INVALID_BENEFIT,
        INVALID_FIRSTNAME,
        INVALID_LASTNAME,
        INVALID_NATIONALINSURANCENUMBER,
        INVALID_HOUSENUMBERANDSTREET,
        INVALID_TOWN,
        INVALID_COUNTY,
        INVALID_POSTCODE,
        INVALID_COUNTRY,
        '1234567',
        INVALID_PHONENUMBER)
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)

      expect(e.validationErrors['EmailAddress'][0]).to.equal('Email address must have valid format')
    }
    done()
  })

  it('should strip illegal characters from fields which accept free text inputs', function (done) {
    const unsafeInputPattern = new RegExp(/>|<|&lt|&gt/g)
    aboutYou = new AboutYou(VALID_DOB,
      VALID_RELATIONSHIP,
      VALID_BENEFIT,
      INVALID_CHARS_FIRSTNAME,
      INVALID_CHARS_LASTNAME,
      VALID_NATIONALINSURANCENUMBER,
      VALID_HOUSENUMBERANDSTREET,
      INVALID_CHARS_TOWN,
      INVALID_CHARS_COUNTY,
      VALID_POSTCODE,
      INVALID_CHARS_COUNTRY,
      VALID_EMAILADDRESS,
      INVALID_CHARS_PHONENUMBER)

    expect(aboutYou.dob).to.deep.equal(dateFormatter.buildFromDateString(VALID_DOB))
    expect(aboutYou.relationship).to.equal(VALID_RELATIONSHIP)
    expect(aboutYou.benefit).to.equal(VALID_BENEFIT)
    expect(aboutYou.firstName).to.equal(INVALID_CHARS_FIRSTNAME.replace(unsafeInputPattern, ''))
    expect(aboutYou.lastName).to.equal(INVALID_CHARS_LASTNAME.replace(unsafeInputPattern, ''))
    expect(aboutYou.nationalInsuranceNumber, 'should uppercase and remove whitespace').to.equal(VALID_NATIONALINSURANCENUMBER.replace(/ /g, '').toUpperCase())
    expect(aboutYou.houseNumberAndStreet).to.equal(INVALID_CHARS_HOUSENUMBERANDSTREET.replace(unsafeInputPattern, ''))
    expect(aboutYou.town).to.equal(INVALID_CHARS_TOWN.replace(unsafeInputPattern, ''))
    expect(aboutYou.county).to.equal(INVALID_CHARS_COUNTY.replace(unsafeInputPattern, ''))
    expect(aboutYou.postCode, 'should uppercase and remove whitespace').to.equal(VALID_POSTCODE.replace(/ /g, '').toUpperCase())
    expect(aboutYou.country).to.equal(INVALID_CHARS_COUNTRY.replace(unsafeInputPattern, ''))
    expect(aboutYou.emailAddress).to.equal(VALID_EMAILADDRESS)
    expect(aboutYou.phoneNumber).to.equal(INVALID_CHARS_PHONENUMBER.replace(unsafeInputPattern, ''))

    done()
  })
})
