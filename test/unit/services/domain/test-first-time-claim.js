const FirstTimeClaim = require('../../../../app/services/domain/first-time-claim')
const ValidationError = require('../../../../app/services/errors/validation-error')
const dateFormatter = require('../../../../app/services/date-formatter')
const expect = require('chai').expect
var claim

describe('services/domain/first-time-claim', function () {
  const VALID_REFERENCE = 'APVS123'
  const VALID_DAY = dateFormatter.now().date()
  const VALID_MONTH = dateFormatter.now().month() + 1 // Needed for zero indexed month
  const VALID_YEAR = dateFormatter.now().year()
  const VALID_CHILD_VISITOR = 'yes'
  var expectedDateOfJourney = dateFormatter.build(VALID_DAY, VALID_MONTH, VALID_YEAR)

  it('should construct a domain object given valid input', function () {
    claim = new FirstTimeClaim(
      VALID_REFERENCE,
      VALID_DAY,
      VALID_MONTH,
      VALID_YEAR,
      VALID_CHILD_VISITOR
    )
    expect(claim.reference).to.equal(VALID_REFERENCE)
    expect(claim.dateOfJourney).to.be.within(
      expectedDateOfJourney.subtract(1, 'seconds').toDate(),
      expectedDateOfJourney.add(1, 'seconds').toDate()
    )
  })

  it('should return isRequired errors given empty strings', function () {
    try {
      claim = new FirstTimeClaim('', '', '', '')
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)
      expect(e.validationErrors['Reference'][0]).to.equal('Reference is required')
      expect(e.validationErrors['DateOfJourney'][0]).to.equal('Date of prison visit was invalid')
    }
  })

  it('should return isValidDate error given an invalid type for date', function () {
    try {
      claim = new FirstTimeClaim(
        VALID_REFERENCE,
        'invalid day',
        'invalid month',
        'invalid year'
      )
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)
      expect(e.validationErrors['DateOfJourney'][0]).to.equal('Date of prison visit was invalid')
    }
  })

  it('should return isValidDate error given a date in the future', function () {
    try {
      var futureDate = dateFormatter.now().add(1)
      claim = new FirstTimeClaim(
        VALID_REFERENCE,
        futureDate.date(),
        futureDate.month() + 1,
        futureDate.year(),
        VALID_CHILD_VISITOR
      )
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)
      expect(e.validationErrors['DateOfJourney'][0]).to.equal('Date of prison visit was invalid')
    }
  })

  it('should return isDateWithinDays error given a date more than 28 days away', function () {
    try {
      var dateFurtherThan28Days = dateFormatter.now().subtract(29)
      claim = new FirstTimeClaim(
        VALID_REFERENCE,
        dateFurtherThan28Days.date(),
        dateFurtherThan28Days.month() + 1,
        dateFurtherThan28Days.year(),
        VALID_CHILD_VISITOR
      )
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)
      expect(e.validationErrors['DateOfJourney'][0]).to.equal('Date of prison must be within 28 days')
    }
  })
})
