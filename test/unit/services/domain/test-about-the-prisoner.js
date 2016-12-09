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

  const INVALID_FIRSTNAME = ''
  const INVALID_LASTNAME = ''
  const INVALID_DOBDAY = ''
  const INVALID_DOBMONTH = ''
  const INVALID_DOBYEAR = ''
  const INVALID_PRISONERNUMBER = ''
  const INVALID_NAMEOFPRISON = ''

  const INVALID_CHARS_FIRSTNAME = 'Joe>&lt><&gt'
  const INVALID_CHARS_LASTNAME = '<Bloggs>'

  it('should return false for valid data', function (done) {
    aboutThePrisoner = new AboutThePrisoner(VALID_FIRSTNAME,
      VALID_LASTNAME,
      VALID_DOBDAY,
      VALID_DOBMONTH,
      VALID_DOBYEAR,
      VALID_PRISONERNUMBER,
      VALID_NAMEOFPRISON)

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

    done()
  })

  it('should return isRequired errors given empty strings', function (done) {
    const IS_REQUIRED = 'is required'

    try {
      aboutThePrisoner = new AboutThePrisoner(INVALID_FIRSTNAME,
        INVALID_LASTNAME,
        INVALID_DOBDAY,
        INVALID_DOBMONTH,
        INVALID_DOBYEAR,
        INVALID_PRISONERNUMBER,
        INVALID_NAMEOFPRISON)
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)

      expect(e.validationErrors['FirstName'][0]).to.contain(IS_REQUIRED)
      expect(e.validationErrors['LastName'][0]).to.contain(IS_REQUIRED)
      expect(e.validationErrors['dob'][0]).to.contain(IS_REQUIRED)
      expect(e.validationErrors['PrisonerNumber'][0]).to.contain(IS_REQUIRED)
      expect(e.validationErrors['NameOfPrison'][0]).to.contain(IS_REQUIRED)
    }
    done()
  })

  it('should return errors for an invalid date', function (done) {
    try {
      aboutThePrisoner = new AboutThePrisoner(INVALID_FIRSTNAME,
        INVALID_LASTNAME,
        '99',
        '01',
        '1995',
        INVALID_PRISONERNUMBER,
        INVALID_NAMEOFPRISON)
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)

      expect(e.validationErrors['dob'][0]).to.equal('Date of birth was invalid')
    }
    done()
  })

  it('should strip illegal characters from otherwise valid data', function (done) {
    const unsafeInputPattern = new RegExp(/>|<|&lt|&gt/g)
    aboutThePrisoner = new AboutThePrisoner(INVALID_CHARS_FIRSTNAME,
      INVALID_CHARS_LASTNAME,
      VALID_DOBDAY,
      VALID_DOBMONTH,
      VALID_DOBYEAR,
      VALID_PRISONERNUMBER,
      VALID_NAMEOFPRISON)

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

    done()
  })
})
