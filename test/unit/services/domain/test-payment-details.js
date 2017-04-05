/* eslint-disable no-new */
const PaymentDetails = require('../../../../app/services/domain/payment-details')
const ValidationError = require('../../../../app/services/errors/validation-error')
const expect = require('chai').expect

var paymentDetails

describe('services/domain/payment-details', function () {
  const VALID_ACCOUNT_NUMBER = ' 123 45678 '
  const VALID_SORT_CODE = '12 345 6'
  const VALID_PAYOUT = 'on'
  const PROCESSED_ACCOUNT_NUMBER = '12345678'
  const PROCESSED_SORT_CODE = '123456'

  it('should construct a domain object given valid input', function () {
    paymentDetails = new PaymentDetails(VALID_ACCOUNT_NUMBER, VALID_SORT_CODE)
    expect(paymentDetails.accountNumber).to.equal(PROCESSED_ACCOUNT_NUMBER)
    expect(paymentDetails.sortCode).to.equal(PROCESSED_SORT_CODE)
  })

  it('should construct a domain object given valid input for payout ignoring invalid bank account details', function () {
    paymentDetails = new PaymentDetails('', '', VALID_PAYOUT)
    expect(paymentDetails.payout).to.equal(VALID_PAYOUT)
  })

  it('should construct a domain object given a sort code with hyphens', function () {
    var sortCodeWithHyphens = '12-12-12'
    var processedSortCodeWithHyphens = '121212'
    paymentDetails = new PaymentDetails(VALID_ACCOUNT_NUMBER, sortCodeWithHyphens)
    expect(paymentDetails.accountNumber).to.equal(PROCESSED_ACCOUNT_NUMBER)
    expect(paymentDetails.sortCode).to.equal(processedSortCodeWithHyphens)
  })

  it('should construct a domain object given a sort code with hyphens and spaces', function () {
    var sortCodeWithHyphensAndSpaces = '12 - 12 - 12'
    var processedSortCodeWithHyphensAndSpaces = '121212'
    paymentDetails = new PaymentDetails(VALID_ACCOUNT_NUMBER, sortCodeWithHyphensAndSpaces)
    expect(paymentDetails.accountNumber).to.equal(PROCESSED_ACCOUNT_NUMBER)
    expect(paymentDetails.sortCode).to.equal(processedSortCodeWithHyphensAndSpaces)
  })

  it('should throw a ValidationError if given empty strings', function () {
    expect(function () {
      new PaymentDetails('', '')
    }).to.throw(ValidationError)
  })

  it('should throw a ValidationError if given letters', function () {
    expect(function () {
      new PaymentDetails('asdf', 'asdf')
    }).to.throw(ValidationError)
  })

  it('should throw a ValidationError if given invalid length inputs', function () {
    expect(function () {
      new PaymentDetails('123456789', '123')
    }).to.throw(ValidationError)
  })
})
