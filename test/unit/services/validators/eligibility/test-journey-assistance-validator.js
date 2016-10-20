const expect = require('chai').expect
const JourneyAssistanceValidator = require('../../../../../app/services/validators/eligibility/journey-assistance-validator')

describe('services/validators/eligibility/journey-assistance-validator', function () {
  const VALID_DATA = {
    'assistance': 'some assistance'
  }
  const INVALID_DATA = {
    'assistance': ''
  }

  it('should throw error if data is null', function (done) {
    expect(function () {
      JourneyAssistanceValidator(null)
        .isRequired()
    }).to.throw(TypeError)
    done()
  })

  it('should throw error if data is undefined', function (done) {
    expect(function () {
      JourneyAssistanceValidator(undefined)
        .isRequired()
    }).to.throw(TypeError)
    done()
  })

  it('should throw error if data is an unexpected object', function (done) {
    expect(function () {
      JourneyAssistanceValidator({})
        .isRequired()
    }).to.throw(TypeError)
    done()
  })

  it('should return false if provided with valid data', function (done) {
    var errors = JourneyAssistanceValidator(VALID_DATA)
    expect(errors).to.equal(false)
    done()
  })

  it('should return an error object if provided with invalid data', function (done) {
    var errors = JourneyAssistanceValidator(INVALID_DATA)
    expect(errors).to.have.property('assistance')
    done()
  })
})
