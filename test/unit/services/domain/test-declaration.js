/* eslint-disable no-new */
const Declaration = require('../../../../app/services/domain/declaration')
const ValidationError = require('../../../../app/services/errors/validation-error')
const expect = require('chai').expect

var declaration

describe('services/domain/payment-details', function () {
  const VALID_TERMS_AND_CONDITIONS = 'yes'

  it('should construct a domain object given valid input', function () {
    declaration = new Declaration(VALID_TERMS_AND_CONDITIONS)
    expect(declaration.termsAndConiditions).to.equal(VALID_TERMS_AND_CONDITIONS)
  })

  it('should throw a ValidationError if given empty strings', function () {
    expect(function () {
      new Declaration('')
    }).to.throw(ValidationError)
  })
})