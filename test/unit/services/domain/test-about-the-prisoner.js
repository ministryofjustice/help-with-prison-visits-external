/* eslint-disable no-new */
const expect = require('chai').expect
const dateFormatter = require('../../../../app/services/date-formatter')
const ValidationError = require('../../../../app/services/errors/validation-error')
const AboutThePrisoner = require('../../../../app/services/domain/about-the-prisoner')

var aboutThePrisoner

describe('services/domain/about-the-prisoner', function () {
  const VALID_FIRST_NAME = 'Joe '
  const VALID_LAST_NAME = ' Bloggs'
  const VALID_DOB_DAY = '01'
  const VALID_DOB_MONTH = '01'
  const VALID_DOB_YEAR = '1995'
  const VALID_PRISONER_NUMBER = 'a1234 BC'
  const VALID_NAME_OF_PRISON = 'Hewell '

  const INVALID_DOB_DAY = '99'
  const INVALID_CHARS_FIRST_NAME = 'Joe>&lt><&gt'
  const INVALID_CHARS_LAST_NAME = '<Bloggs>'

  it('should construct a domain object given valid input', function () {
    aboutThePrisoner = new AboutThePrisoner(VALID_FIRST_NAME,
      VALID_LAST_NAME,
      VALID_DOB_DAY,
      VALID_DOB_MONTH,
      VALID_DOB_YEAR,
      VALID_PRISONER_NUMBER,
      VALID_NAME_OF_PRISON
    )

    expect(aboutThePrisoner.firstName).to.equal(VALID_FIRST_NAME.trim())
    expect(aboutThePrisoner.lastName).to.equal(VALID_LAST_NAME.trim())
    expect(aboutThePrisoner.dobDay).to.equal(VALID_DOB_DAY)
    expect(aboutThePrisoner.dobMonth).to.equal(VALID_DOB_MONTH)
    expect(aboutThePrisoner.dobYear).to.equal(VALID_DOB_YEAR)
    expect(aboutThePrisoner.prisonerNumber).to.equal(VALID_PRISONER_NUMBER.replace(/ /g, '').toUpperCase())
    expect(aboutThePrisoner.nameOfPrison).to.equal(VALID_NAME_OF_PRISON.trim())
    expect(aboutThePrisoner.dob).to.be.within(
      dateFormatter.buildFromDateString('1995-01-01').subtract(1, 'seconds').toDate(),
      dateFormatter.buildFromDateString('1995-01-01').add(1, 'seconds').toDate())
  })

  it('should throw a ValidationError if invalid input', function () {
    expect(function () {
      new AboutThePrisoner('', '', '', '', '', '', '')
    }).to.throw(ValidationError)
  })

  it('should throw a ValidationError if an invalid date of birth is provided as input', function () {
    expect(function () {
      new AboutThePrisoner(
        VALID_FIRST_NAME,
        VALID_LAST_NAME,
        INVALID_DOB_DAY,
        VALID_DOB_MONTH,
        VALID_DOB_YEAR,
        VALID_PRISONER_NUMBER,
        VALID_NAME_OF_PRISON
      )
    }).to.throw(ValidationError)
  })

  it('should strip illegal characters from otherwise valid data', function () {
    const unsafeInputPattern = new RegExp(/>|<|&lt|&gt/g)
    aboutThePrisoner = new AboutThePrisoner(INVALID_CHARS_FIRST_NAME,
      INVALID_CHARS_LAST_NAME,
      VALID_DOB_DAY,
      VALID_DOB_MONTH,
      VALID_DOB_YEAR,
      VALID_PRISONER_NUMBER,
      VALID_NAME_OF_PRISON
    )

    expect(aboutThePrisoner.firstName).to.equal(INVALID_CHARS_FIRST_NAME.replace(unsafeInputPattern, ''))
    expect(aboutThePrisoner.lastName).to.equal(INVALID_CHARS_LAST_NAME.replace(unsafeInputPattern, ''))
    expect(aboutThePrisoner.dobDay).to.equal(VALID_DOB_DAY)
    expect(aboutThePrisoner.dobMonth).to.equal(VALID_DOB_MONTH)
    expect(aboutThePrisoner.dobYear).to.equal(VALID_DOB_YEAR)
    expect(aboutThePrisoner.prisonerNumber).to.equal(VALID_PRISONER_NUMBER.replace(/ /g, '').toUpperCase())
    expect(aboutThePrisoner.nameOfPrison).to.equal(VALID_NAME_OF_PRISON.trim())
    expect(aboutThePrisoner.dob).to.be.within(
      dateFormatter.buildFromDateString('1995-01-01').subtract(1, 'seconds').toDate(),
      dateFormatter.buildFromDateString('1995-01-01').add(1, 'seconds').toDate())
  })
})
