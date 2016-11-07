// TODO: Add claim details domain object
const FirstTimeClaim = require('../../../../app/services/domain/first-time-claim')
const ValidationError = require('../../../../app/services/errors/validation-error')
const dateFormatter = require('../../../../app/services/date-formatter')
const expect = require('chai').expect
var claim

describe('services/domain/first-time-claim', function () {
  const VALID_REFERENCE = 'APVS123'
  const VALID_DAY = '26'
  const VALID_MONTH = '10'
  const VALID_YEAR = '2016'
  var expectedDateOfJourney = dateFormatter.build(VALID_DAY, VALID_MONTH, VALID_YEAR)

  it('should construct a domain object given valid input', function (done) {
    claim = new FirstTimeClaim(
      VALID_REFERENCE,
      VALID_DAY,
      VALID_MONTH,
      VALID_YEAR
    )
    expect(claim.reference).to.equal(VALID_REFERENCE)
    expect(claim.dateOfJourney).to.be.within(
        expectedDateOfJourney.subtract(1, 'seconds').toDate(),
        expectedDateOfJourney.add(1, 'seconds').toDate()
    )
    done()
  })

  it('should return isRequired errors given empty strings', function (done) {
    try {
      claim = new FirstTimeClaim('', '', '', '')
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)
      expect(e.validationErrors['Reference'][0]).to.equal('Reference is required')
      expect(e.validationErrors['DateOfJourney'][0]).to.equal('Date of journey was invalid')
    }
    done()
  })

  it('should return isValidDate error given an invalid type for date', function (done) {
    try {
      claim = new FirstTimeClaim(
        VALID_REFERENCE,
        'invalid day',
        'invalid month',
        'invalid year'
      )
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)
      expect(e.validationErrors['DateOfJourney'][0]).to.equal('Date of journey was invalid')
    }
    done()
  })

  it('should return isValidDate error given a date in the future', function (done) {
    try {
      var futureDate = dateFormatter.now().add(1)
      claim = new FirstTimeClaim(
        VALID_REFERENCE,
        futureDate.get('date'), // day
        futureDate.get('month') + 1,
        futureDate.get('year')
      )
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)
      expect(e.validationErrors['DateOfJourney'][0]).to.equal('Date of journey was invalid')
    }
    done()
  })
})
