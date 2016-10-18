const expect = require('chai').expect
const BenefitValidator = require('../../../../../app/services/validators/eligibility/benefit-validator')

describe('services/validators/eligibility/benefit-validator', function () {
  const VALID_DATA = {
    'benefit': 'some benefit'
  }
  const INVALID_DATA = {
    'benefit': ''
  }

  it('should throw error if data is null', function (done) {
    expect(function () {
      BenefitValidator(null)
        .isRequired()
    }).to.throw(TypeError)
    done()
  })

  it('should throw error if data is undefined', function (done) {
    expect(function () {
      BenefitValidator(undefined)
        .isRequired()
    }).to.throw(TypeError)
    done()
  })

  it('should throw error if data is an unexpected object', function (done) {
    expect(function () {
      BenefitValidator({})
        .isRequired()
    }).to.throw(TypeError)
    done()
  })

  it('should return false if provided with valid data', function (done) {
    var errors = BenefitValidator(VALID_DATA)
    expect(errors).to.equal(false)
    done()
  })

  it('should return an error object if provided with invalid data', function (done) {
    var errors = BenefitValidator(INVALID_DATA)
    expect(errors).to.have.property('benefit')
    done()
  })
})
