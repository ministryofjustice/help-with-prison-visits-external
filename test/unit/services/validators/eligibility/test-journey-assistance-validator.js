var proxyquire = require('proxyquire')
var sinon = require('sinon')
var expect = require('chai').expect
var fieldValidator = require('../../../../../app/services/validators/field-validator')

describe('journey-assistance-validator', function () {
  var journeyAssistanceValidator
  var mockFieldValidatorFactory
  var fieldValidators
  var data

  beforeEach(function () {
    data = {
      'journey-assistance': 'No'
    }

    fieldValidators = {}
    mockFieldValidatorFactory = function (data, fieldName, errors) {
      var fieldValidatorSpied = fieldValidator(data, fieldName, errors)
      fieldValidatorSpied.spyIsRequired = sinon.spy(fieldValidatorSpied, 'isRequired')
      fieldValidators[fieldName] = fieldValidatorSpied
      return fieldValidatorSpied
    }

    journeyAssistanceValidator = proxyquire('../../../../../app/services/validators/eligibility/journey-assistance-validator', {
      '../field-validator': mockFieldValidatorFactory
    })
  })

  it('should return false for valid data', function (done) {
    var errors = journeyAssistanceValidator(data)
    expect(errors).to.be.false

    expect(fieldValidators['journey-assistance']).to.exist
    sinon.assert.calledOnce(fieldValidators['journey-assistance'].spyIsRequired)

    done()
  })

  it('should return errors for no data input', function (done) {
    data = {}

    var errors = journeyAssistanceValidator(data)
    expect(errors).to.have.all.keys([
      'journey-assistance'
    ])

    var errorMessage = errors['journey-assistance'][0]
    expect(errorMessage).to.equal('Select an option to specify if you need assistance on your journey')

    done()
  })
})
