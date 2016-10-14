var proxyquire = require('proxyquire')
var sinon = require('sinon')
var expect = require('chai').expect
var fieldValidator = require('../../../../../app/services/validators/field-validator')

describe('prisoner-relationship-validator', function () {
  var prisonerRelationshipValidator
  var mockFieldValidatorFactory
  var fieldValidators
  var data

  beforeEach(function () {
    data = {
      'relationship': 'Partner'
    }

    fieldValidators = {}
    mockFieldValidatorFactory = function (data, fieldName, errors) {
      var fieldValidatorSpied = fieldValidator(data, fieldName, errors)
      fieldValidatorSpied.spyIsRequired = sinon.spy(fieldValidatorSpied, 'isRequired')
      fieldValidators[fieldName] = fieldValidatorSpied
      return fieldValidatorSpied
    }

    prisonerRelationshipValidator = proxyquire('../../../../../app/services/validators/eligibility/prisoner-relationship-validator', {
      '../field-validator': mockFieldValidatorFactory
    })
  })

  it('should return false for valid data', function (done) {
    var errors = prisonerRelationshipValidator(data)
    expect(errors).to.be.false

    expect(fieldValidators['relationship']).to.exist
    sinon.assert.calledOnce(fieldValidators['relationship'].spyIsRequired)

    done()
  })

  it('should return errors for no data input', function (done) {
    data = {}

    var errors = prisonerRelationshipValidator(data)
    expect(errors).to.have.all.keys([
      'relationship'
    ])

    var titleErrorMessage = errors['relationship'][0]
    expect(titleErrorMessage).to.equal('Relationship is required')

    done()
  })
})
