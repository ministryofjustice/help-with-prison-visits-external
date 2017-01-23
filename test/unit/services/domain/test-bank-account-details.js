const BankAccountDetails = require('../../../../app/services/domain/bank-account-details')
const ValidationError = require('../../../../app/services/errors/validation-error')
const expect = require('chai').expect
var bankAccountDetails

describe('services/domain/bank-account-details', function () {
  const VALID_ACCOUNT_NUMBER = ' 123 45678 '
  const VALID_SORT_CODE = '12 345 6'
  const VALID_TERMS_AND_CONDITIONS = 'yes'
  const PROCESSED_ACCOUNT_NUMBER = '12345678'
  const PROCESSED_SORT_CODE = '123456'

  it('should construct a domain object given valid input', function (done) {
    bankAccountDetails = new BankAccountDetails(VALID_ACCOUNT_NUMBER, VALID_SORT_CODE, VALID_TERMS_AND_CONDITIONS)
    expect(bankAccountDetails.accountNumber).to.equal(PROCESSED_ACCOUNT_NUMBER)
    expect(bankAccountDetails.sortCode).to.equal(PROCESSED_SORT_CODE)
    expect(bankAccountDetails.termsAndConiditions).to.equal(VALID_TERMS_AND_CONDITIONS)
    done()
  })

  it('should construct a domain object given a sort code with hyphens', function (done) {
    var sortCodeWithHyphens = '12-12-12'
    var processedSortCodeWithHyphens = '121212'
    bankAccountDetails = new BankAccountDetails(VALID_ACCOUNT_NUMBER, sortCodeWithHyphens, VALID_TERMS_AND_CONDITIONS)
    expect(bankAccountDetails.accountNumber).to.equal(PROCESSED_ACCOUNT_NUMBER)
    expect(bankAccountDetails.sortCode).to.equal(processedSortCodeWithHyphens)
    expect(bankAccountDetails.termsAndConiditions).to.equal(VALID_TERMS_AND_CONDITIONS)
    done()
  })

  it('should construct a domain object given a sort code with hyphens and spaces', function (done) {
    var sortCodeWithHyphensAndSpaces = '12 - 12 - 12'
    var processedSortCodeWithHyphensAndSpaces = '121212'
    bankAccountDetails = new BankAccountDetails(VALID_ACCOUNT_NUMBER, sortCodeWithHyphensAndSpaces, VALID_TERMS_AND_CONDITIONS)
    expect(bankAccountDetails.accountNumber).to.equal(PROCESSED_ACCOUNT_NUMBER)
    expect(bankAccountDetails.sortCode).to.equal(processedSortCodeWithHyphensAndSpaces)
    expect(bankAccountDetails.termsAndConiditions).to.equal(VALID_TERMS_AND_CONDITIONS)
    done()
  })

  it('should return isRequired errors given empty strings', function (done) {
    try {
      bankAccountDetails = new BankAccountDetails('', '', '')
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)
      expect(e.validationErrors['AccountNumber'][0]).to.equal('Account number is required')
      expect(e.validationErrors['SortCode'][0]).to.equal('Sort code is required')
      expect(e.validationErrors['terms-and-conditions'][0]).to.equal('Agreement to our terms and conditions is required')
    }
    done()
  })

  it('should return isNumber errors given letters', function (done) {
    try {
      bankAccountDetails = new BankAccountDetails('asdf', 'asdf', VALID_TERMS_AND_CONDITIONS)
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)
      expect(e.validationErrors['AccountNumber'][0]).to.equal('Account number must only contain numbers')
      expect(e.validationErrors['SortCode'][0]).to.equal('Sort code must only contain numbers')
    }
    done()
  })

  it('should return isLength errors given invalid length', function (done) {
    try {
      bankAccountDetails = new BankAccountDetails('123456789', '123', VALID_TERMS_AND_CONDITIONS)
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)
      expect(e.validationErrors['AccountNumber'][0]).to.equal('Account number must be 8 characters in length')
      expect(e.validationErrors['SortCode'][0]).to.equal('Sort code must be 6 characters in length')
    }
    done()
  })
})
