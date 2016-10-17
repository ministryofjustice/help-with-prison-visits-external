var proxyquire = require('proxyquire')
var sinon = require('sinon')
var expect = require('chai').expect
var fieldValidator = require('../../../../../app/services/validators/field-validator')

describe('benefit-validator', function () {
  var benefitValidator
  var mockFieldValidatorFactory
  var fieldValidators
  var data

  beforeEach(function () {
    data = {
      'benefit': 'Income Support'
    }

    fieldValidators = {}
    mockFieldValidatorFactory = function (data, fieldName, errors) {
      var fieldValidatorSpied = fieldValidator(data, fieldName, errors)
      fieldValidatorSpied.spyIsRequired = sinon.spy(fieldValidatorSpied, 'isRequired')
      fieldValidators[fieldName] = fieldValidatorSpied
      return fieldValidatorSpied
    }

    benefitValidator = proxyquire('../../../../../app/services/validators/eligibility/benefit-validator', {
      '../field-validator': mockFieldValidatorFactory
    })
  })

  it('should return false for valid data', function (done) {
    var errors = benefitValidator(data)
    expect(errors).to.be.false

    expect(fieldValidators['benefit']).to.exist
    sinon.assert.calledOnce(fieldValidators['benefit'].spyIsRequired)

    done()
  })

  it('should return errors for no data input', function (done) {
    data = {}

    var errors = benefitValidator(data)
    expect(errors).to.have.all.keys([
      'benefit'
    ])

    var titleErrorMessage = errors['benefit'][0]
    expect(titleErrorMessage).to.equal('Benefit is required')

    done()
  })
})
