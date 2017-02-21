/* eslint-disable no-new */
const PaymentDetails = require('../../../../app/services/domain/payment-details')
const ValidationError = require('../../../../app/services/errors/validation-error')
const expect = require('chai').expect

var paymentDetails

describe('services/domain/payment-details', function () {
  const VALID_ACCOUNT_NUMBER = ' 123 45678 '
  const VALID_SORT_CODE = '12 345 6'
  const VALID_TERMS_AND_CONDITIONS = 'yes'
  const PROCESSED_ACCOUNT_NUMBER = '12345678'
  const PROCESSED_SORT_CODE = '123456'

  it('should construct a domain object given valid input', function () {
    paymentDetails = new PaymentDetails(VALID_ACCOUNT_NUMBER, VALID_SORT_CODE, VALID_TERMS_AND_CONDITIONS)
    expect(paymentDetails.accountNumber).to.equal(PROCESSED_ACCOUNT_NUMBER)
    expect(paymentDetails.sortCode).to.equal(PROCESSED_SORT_CODE)
    expect(paymentDetails.termsAndConiditions).to.equal(VALID_TERMS_AND_CONDITIONS)
  })

  it('should construct a domain object given a sort code with hyphens', function () {
    var sortCodeWithHyphens = '12-12-12'
    var processedSortCodeWithHyphens = '121212'
    paymentDetails = new PaymentDetails(VALID_ACCOUNT_NUMBER, sortCodeWithHyphens, VALID_TERMS_AND_CONDITIONS)
    expect(paymentDetails.accountNumber).to.equal(PROCESSED_ACCOUNT_NUMBER)
    expect(paymentDetails.sortCode).to.equal(processedSortCodeWithHyphens)
    expect(paymentDetails.termsAndConiditions).to.equal(VALID_TERMS_AND_CONDITIONS)
  })

  it('should construct a domain object given a sort code with hyphens and spaces', function () {
    var sortCodeWithHyphensAndSpaces = '12 - 12 - 12'
    var processedSortCodeWithHyphensAndSpaces = '121212'
    paymentDetails = new PaymentDetails(VALID_ACCOUNT_NUMBER, sortCodeWithHyphensAndSpaces, VALID_TERMS_AND_CONDITIONS)
    expect(paymentDetails.accountNumber).to.equal(PROCESSED_ACCOUNT_NUMBER)
    expect(paymentDetails.sortCode).to.equal(processedSortCodeWithHyphensAndSpaces)
    expect(paymentDetails.termsAndConiditions).to.equal(VALID_TERMS_AND_CONDITIONS)
  })

  it('should throw a ValidationError if given empty strings', function () {
    expect(function () {
      new PaymentDetails('', '', '')
    }).to.throw(ValidationError)
  })

  it('should throw a ValidationError if given letters', function () {
    expect(function () {
      new PaymentDetails('asdf', 'asdf', VALID_TERMS_AND_CONDITIONS)
    }).to.throw(ValidationError)
  })

  it('should throw a ValidationError if given invalid length inputs', function () {
    expect(function () {
      new PaymentDetails('123456789', '123', VALID_TERMS_AND_CONDITIONS)
    }).to.throw(ValidationError)
  })
})
