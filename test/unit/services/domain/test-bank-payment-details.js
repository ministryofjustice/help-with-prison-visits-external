/* eslint-disable no-new */
const BankAccountDetails = require('../../../../app/services/domain/bank-account-details')
const ValidationError = require('../../../../app/services/errors/validation-error')
const expect = require('chai').expect

var bankAccountDetails

const VALID_SORT_CODE = '87 65 43'
const VALID_ACCOUNT_NUMBER = '123 45678 '
const PROCESSED_ACCOUNT_NUMBER = '12345678'
const PROCESSED_SORT_CODE = '876543'

describe('services/domain/payment-details', function () {

  it('should construct a domain object given valid input', function () {
    bankAccountDetails = new BankAccountDetails(VALID_ACCOUNT_NUMBER, VALID_SORT_CODE)
    expect(bankAccountDetails.sortCode).to.equal(PROCESSED_SORT_CODE)
    expect(bankAccountDetails.accountNumber).to.equal(PROCESSED_ACCOUNT_NUMBER)
  })

  it('should construct a domain object given a sort code with hyphens', function () {
    var sortCodeWithHyphens = '12-12-12'
    var processedSortCodeWithHyphens = '121212'
    bankAccountDetails = new BankAccountDetails(VALID_ACCOUNT_NUMBER, sortCodeWithHyphens)
    expect(bankAccountDetails.accountNumber).to.equal(PROCESSED_ACCOUNT_NUMBER)
    expect(bankAccountDetails.sortCode).to.equal(processedSortCodeWithHyphens)
  })

  it('should construct a domain object given a sort code with hyphens and spaces', function () {
    var sortCodeWithHyphensAndSpaces = '12 - 12 - 12'
    var processedSortCodeWithHyphensAndSpaces = '121212'
    bankAccountDetails = new BankAccountDetails(VALID_ACCOUNT_NUMBER, sortCodeWithHyphensAndSpaces)
    expect(bankAccountDetails.accountNumber).to.equal(PROCESSED_ACCOUNT_NUMBER)
    expect(bankAccountDetails.sortCode).to.equal(processedSortCodeWithHyphensAndSpaces)
  })

  it('should throw a ValidationError if given empty strings', function () {
    expect(function () {
      new BankAccountDetails('', '')
    }).to.throw(ValidationError)
  })

  it('should throw a ValidationError if given letters', function () {
    expect(function () {
      new BankAccountDetails('asdf', 'asdf')
    }).to.throw(ValidationError)
  })

  it('should throw a ValidationError if given invalid length inputs', function () {
    expect(function () {
      new BankAccountDetails('123456789', '123')
    }).to.throw(ValidationError)
  })
})
