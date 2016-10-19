var proxyquire = require('proxyquire')
var sinon = require('sinon')
var expect = require('chai').expect
var fieldValidator = require('../../../../../app/services/validators/field-validator')
var fieldsetValidator = require('../../../../../app/services/validators/fieldset-validator')

describe('journey-assistance-validator', function () {
  var aboutThePrisonerValidator
  var mockFieldValidatorFactory
  var mockFieldsetValidatorFactory
  var fieldValidators
  var fieldsetValidators
  var data

  beforeEach(function () {
    data = {
      'firstName': 'Joe',
      'lastName': 'Bloggs',
      'dob-day': '01',
      'dob-month': '01',
      'dob-year': '1995',
      'prisonerNumber': 'A1234BC',
      'nameOfPrison': 'Hewell'
    }

    fieldValidators = {}
    mockFieldValidatorFactory = function (data, fieldName, errors) {
      var fieldValidatorSpied = fieldValidator(data, fieldName, errors)
      fieldValidatorSpied.spyIsRequired = sinon.spy(fieldValidatorSpied, 'isRequired')
      fieldValidators[fieldName] = fieldValidatorSpied
      return fieldValidatorSpied
    }

    mockFieldsetValidatorFactory = function (data, fieldName, errors) {
      var fieldsetValidatorSpied = fieldsetValidator(data, fieldName, errors)
      fieldsetValidatorSpied.spyIsRequired = sinon.spy(fieldsetValidatorSpied, 'isRequired')
      fieldsetValidators[fieldName] = fieldsetValidatorSpied
      return fieldsetValidatorSpied
    }

    aboutThePrisonerValidator = proxyquire('../../../../../app/services/validators/first-time/about-the-prisoner-validator', {
      '../field-validator': mockFieldValidatorFactory,
      '../fieldset-validator': mockFieldsetValidatorFactory
    })
  })

  it('should return false for valid data', function (done) {
    var errors = aboutThePrisonerValidator(data)
    expect(errors).to.be.false

    for (var field in data) {
      expect(fieldValidators[field]).to.exist
      sinon.assert.calledOnce(fieldValidators[field].spyIsRequired)
    }

    expect(fieldsetValidators['dob']).to.exist
    sinon.assert.calledOnce(fieldsetValidators[field].spyIsRequired)
  })

  it('should return errors for no data input', function (done) {
    data = {
      'firstName': '',
      'lastName': '',
      'dob-day': '',
      'dob-month': '',
      'dob-year': '',
      'prisonerNumber': '',
      'nameOfPrison': ''
    }

    var errors = aboutThePrisonerValidator(data)
    expect(errors).to.have.all.keys([
      'firstName',
      'lastName',
      'dob-day',
      'dob-month',
      'dob-year',
      'prisonerNumber',
      'nameOfPrison'
    ])

    var errorMessage = errors['firstName'][0]
    expect(errorMessage).to.equal('First name is required')

    done()
  })

  it('should return errors for an invalid date', function (done) {
    data['dob-day'] = '99'

    var errors = aboutThePrisonerValidator(data)
    expect(errors).to.have.all.keys([
      'dob'
    ])

    var errorMessage = errors['dob'][0]
    expect(errorMessage).to.equal('Date of Birth was invalid')

    done()
  })
})
