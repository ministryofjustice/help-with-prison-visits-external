const expect = require('chai').expect
const PrisonerRelationshipValidator = require('../../../../../app/services/validators/eligibility/prisoner-relationship-validator')

describe('services/validators/eligibility/prisoner-relationship-validator', function () {
  const VALID_DATA = {
    'relationship': 'some assistance'
  }
  const INVALID_DATA = {
    'relationship': ''
  }

  it('should throw error if data is null', function (done) {
    expect(function () {
      PrisonerRelationshipValidator(null)
        .isRequired()
    }).to.throw(TypeError)
    done()
  })

  it('should throw error if data is undefined', function (done) {
    expect(function () {
      PrisonerRelationshipValidator(undefined)
        .isRequired()
    }).to.throw(TypeError)
    done()
  })

  it('should throw error if data is an unexpected object', function (done) {
    expect(function () {
      PrisonerRelationshipValidator({})
        .isRequired()
    }).to.throw(TypeError)
    done()
  })

  it('should return false if provided with valid data', function (done) {
    var errors = PrisonerRelationshipValidator(VALID_DATA)
    expect(errors).to.equal(false)
    done()
  })

  it('should return an error object if provided with invalid data', function (done) {
    var errors = PrisonerRelationshipValidator(INVALID_DATA)
    expect(errors).to.have.property('relationship')
    done()
  })
})
