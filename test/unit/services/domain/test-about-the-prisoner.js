/* eslint-disable no-new */
const expect = require('chai').expect
const dateFormatter = require('../../../../app/services/date-formatter')
const ValidationError = require('../../../../app/services/errors/validation-error')
const AboutThePrisoner = require('../../../../app/services/domain/about-the-prisoner')

var aboutThePrisoner

describe('services/domain/about-the-prisoner', function () {
  const VALID_FIRSTNAME = 'Joe '
  const VALID_LASTNAME = ' Bloggs'
  const VALID_DOBDAY = '01'
  const VALID_DOBMONTH = '01'
  const VALID_DOBYEAR = '1995'
  const VALID_PRISONERNUMBER = 'a1234 BC'
  const VALID_NAMEOFPRISON = 'Hewell '

  const INVALID_CHARS_FIRSTNAME = 'Joe>&lt><&gt'
  const INVALID_CHARS_LASTNAME = '<Bloggs>'

  it('should return false for valid data', function () {
    aboutThePrisoner = new AboutThePrisoner(VALID_FIRSTNAME,
      VALID_LASTNAME,
      VALID_DOBDAY,
      VALID_DOBMONTH,
      VALID_DOBYEAR,
      VALID_PRISONERNUMBER,
      VALID_NAMEOFPRISON
    )

    expect(aboutThePrisoner.firstName).to.equal(VALID_FIRSTNAME.trim())
    expect(aboutThePrisoner.lastName).to.equal(VALID_LASTNAME.trim())
    expect(aboutThePrisoner.dobDay).to.equal(VALID_DOBDAY)
    expect(aboutThePrisoner.dobMonth).to.equal(VALID_DOBMONTH)
    expect(aboutThePrisoner.dobYear).to.equal(VALID_DOBYEAR)
    expect(aboutThePrisoner.prisonerNumber).to.equal(VALID_PRISONERNUMBER.replace(/ /g, '').toUpperCase())
    expect(aboutThePrisoner.nameOfPrison).to.equal(VALID_NAMEOFPRISON.trim())
    expect(aboutThePrisoner.dob).to.be.within(
      dateFormatter.buildFromDateString('1995-01-01').subtract(1, 'seconds').toDate(),
      dateFormatter.buildFromDateString('1995-01-01').add(1, 'seconds').toDate())
  })

  it('should return isRequired errors given empty strings', function () {
    expect(function () {
      new AboutThePrisoner('', '', '', '', '', '', '')
    }).to.throw(ValidationError)
  })

  it('should return errors for an invalid date', function () {
    expect(function () {
      new AboutThePrisoner(
        VALID_FIRSTNAME,
        VALID_LASTNAME,
        '99',
        '01',
        '1995',
        VALID_PRISONERNUMBER,
        VALID_NAMEOFPRISON
      )
    }).to.throw(ValidationError)
  })

  it('should strip illegal characters from otherwise valid data', function () {
    const unsafeInputPattern = new RegExp(/>|<|&lt|&gt/g)
    aboutThePrisoner = new AboutThePrisoner(INVALID_CHARS_FIRSTNAME,
      INVALID_CHARS_LASTNAME,
      VALID_DOBDAY,
      VALID_DOBMONTH,
      VALID_DOBYEAR,
      VALID_PRISONERNUMBER,
      VALID_NAMEOFPRISON
    )

    expect(aboutThePrisoner.firstName).to.equal(INVALID_CHARS_FIRSTNAME.replace(unsafeInputPattern, ''))
    expect(aboutThePrisoner.lastName).to.equal(INVALID_CHARS_LASTNAME.replace(unsafeInputPattern, ''))
    expect(aboutThePrisoner.dobDay).to.equal(VALID_DOBDAY)
    expect(aboutThePrisoner.dobMonth).to.equal(VALID_DOBMONTH)
    expect(aboutThePrisoner.dobYear).to.equal(VALID_DOBYEAR)
    expect(aboutThePrisoner.prisonerNumber).to.equal(VALID_PRISONERNUMBER.replace(/ /g, '').toUpperCase())
    expect(aboutThePrisoner.nameOfPrison).to.equal(VALID_NAMEOFPRISON.trim())
    expect(aboutThePrisoner.dob).to.be.within(
      dateFormatter.buildFromDateString('1995-01-01').subtract(1, 'seconds').toDate(),
      dateFormatter.buildFromDateString('1995-01-01').add(1, 'seconds').toDate())
  })
})
