const BankAccountDetails = require('../../../../app/services/domain/bank-account-details')
const ValidationError = require('../../../../app/services/errors/validation-error')
const expect = require('chai').expect
var bankAccountDetails

describe('services/domain/bank-account-details', function () {
  const VALID_ACCOUNT_NUMBER = ' 123 45678 '
  const VALID_SORT_CODE = '12 345 6'
  const PROCESSED_ACCOUNT_NUMBER = '12345678'
  const PROCESSED_SORT_CODE = '123456'

  it('should construct a domain object given valid input', function (done) {
    bankAccountDetails = new BankAccountDetails(VALID_ACCOUNT_NUMBER, VALID_SORT_CODE)
    expect(bankAccountDetails.AccountNumber).to.equal(PROCESSED_ACCOUNT_NUMBER)
    expect(bankAccountDetails.SortCode).to.equal(PROCESSED_SORT_CODE)
    done()
  })

  it('should return isRequired errors given empty strings', function (done) {
    try {
      bankAccountDetails = new BankAccountDetails('', '')
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)
      expect(e.validationErrors['AccountNumber'][0]).to.equal('Account Number is required')
      expect(e.validationErrors['SortCode'][0]).to.equal('Sort Code is required')
    }
    done()
  })

  it('should return isNumber errors given letters', function (done) {
    try {
      bankAccountDetails = new BankAccountDetails('asdf', 'asdf')
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)
      expect(e.validationErrors['AccountNumber'][0]).to.equal('Account Number must only contain numbers')
      expect(e.validationErrors['SortCode'][0]).to.equal('Sort Code must only contain numbers')
    }
    done()
  })

  it('should return isLength errors given invalid length', function (done) {
    try {
      bankAccountDetails = new BankAccountDetails('123456789', '123')
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)
      expect(e.validationErrors['AccountNumber'][0]).to.equal('Account Number must be 8 characters in length')
      expect(e.validationErrors['SortCode'][0]).to.equal('Sort Code must be 6 characters in length')
    }
    done()
  })
})
