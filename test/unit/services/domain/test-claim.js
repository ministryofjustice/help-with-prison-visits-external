// TODO: Add claim details domain object
const Claim = require('../../../../app/services/domain/claim')
const ValidationError = require('../../../../app/services/errors/validation-error')
const expect = require('chai').expect
const moment = require('moment')
var claim

describe('services/domain/claim', function () {
  const VALID_REFERENCE = '  APVS12 3 '
  const PROCESSED_REFERENCE = 'APVS123'
  const VALID_DATE_OF_JOURNEY = moment()
  const VALID_DATE_CREATED = moment()
  const VALID_DATE_SUBMITTED = moment()
  const VALID_STATUS = 'IN-PROGRESS'

  it('should construct a domain object given valid input', function (done) {
    claim = new Claim(
      VALID_REFERENCE,
      VALID_DATE_OF_JOURNEY,
      VALID_DATE_CREATED,
      VALID_DATE_SUBMITTED,
      VALID_STATUS
    )

    expect(claim.reference).to.equal(PROCESSED_REFERENCE)
    expect(claim.dateOfJourney).to.equal(VALID_DATE_OF_JOURNEY)
    expect(claim.dateCreated).to.equal(VALID_DATE_CREATED)
    expect(claim.dateSubmitted).to.equal(VALID_DATE_SUBMITTED)
    expect(claim.status).to.equal(VALID_STATUS)
    done()
  })

  it('should return isValidReference error given an invalid reference', function (done) {
    try {
      claim = new Claim(
        'APVS12345',
        VALID_DATE_OF_JOURNEY,
        VALID_DATE_CREATED,
        VALID_DATE_SUBMITTED,
        VALID_STATUS
      )
    } catch (error) {
      expect(error).to.be.instanceof(ValidationError)
      expect(error.validationErrors['Reference'][0]).to.equal('Reference must have valid format')
    }
    done()
  })

  it('should return isRequired errors given empty strings', function (done) {
    try {
      claim = new Claim('', '', '', '', '')
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)
      expect(e.validationErrors['Reference'][0]).to.equal('Reference is required')
      expect(e.validationErrors['DateOfJourney'][0]).to.equal('Date of journey was invalid')
      expect(e.validationErrors['DateCreated'][0]).to.equal('Date created was invalid')
      expect(e.validationErrors['Status'][0]).to.equal('Status is required')
    }
    done()
  })

  it('should return isValidDate error given an invalid type for date', function (done) {
    try {
      claim = new Claim(
        VALID_REFERENCE,
        'invalid date',
        '',
        VALID_DATE_SUBMITTED,
        VALID_STATUS
      )
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)
      expect(e.validationErrors['DateOfJourney'][0]).to.equal('Date of journey was invalid')
      expect(e.validationErrors['DateCreated'][0]).to.equal('Date created was invalid')
    }
    done()
  })

  it('should return isValidDate error given a date in the past', function (done) {
    try {
      var futureDate = moment().add(1).toDate()
      claim = new Claim(
        VALID_REFERENCE,
        futureDate,
        VALID_DATE_CREATED,
        VALID_DATE_SUBMITTED,
        VALID_STATUS
      )
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)
      expect(e.validationErrors['DateOfJourney'][0]).to.equal('Date of journey was invalid')
    }
    done()
  })

  it('should return isValidStatus error given an invalid status', function (done) {
    try {
      claim = new Claim(
        VALID_REFERENCE,
        VALID_DATE_OF_JOURNEY,
        VALID_DATE_CREATED,
        VALID_DATE_SUBMITTED,
        'invalid status'
      )
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)
      expect(e.validationErrors['Status'][0]).to.equal('Status must be a valid claim status')
    }
    done()
  })
})
