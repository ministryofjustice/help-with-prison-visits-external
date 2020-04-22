/* eslint-disable no-new */
const BankAccountDetails = require('../../../../app/services/domain/bank-account-details')
const expect = require('chai').expect

var bankAccountDetails

const VALID_SORT_CODE = '87 65 43'
const VALID_ACCOUNT_NUMBER = '123 45678 '
const VALID_NAME_ON_ACCOUNT = ' MR JOSEPH BLOGGS  '
const VALID_ROLL_NUMBER = 'ROLL NUMBER-1.'
const PROCESSED_ACCOUNT_NUMBER = '12345678'
const PROCESSED_SORT_CODE = '876543'

describe('services/domain/payment-details', function () {
  it('should construct a domain object given valid input', function () {
    bankAccountDetails = new BankAccountDetails(VALID_ACCOUNT_NUMBER, VALID_SORT_CODE, VALID_NAME_ON_ACCOUNT, VALID_ROLL_NUMBER)
    expect(bankAccountDetails.sortCode).to.equal(PROCESSED_SORT_CODE)
    expect(bankAccountDetails.accountNumber).to.equal(PROCESSED_ACCOUNT_NUMBER)
  })

  it('should construct a domain object given a sort code with hyphens', function () {
    var sortCodeWithHyphens = '12-12-12'
    var processedSortCodeWithHyphens = '121212'
    bankAccountDetails = new BankAccountDetails(VALID_ACCOUNT_NUMBER, sortCodeWithHyphens, VALID_NAME_ON_ACCOUNT, VALID_ROLL_NUMBER)
    expect(bankAccountDetails.accountNumber).to.equal(PROCESSED_ACCOUNT_NUMBER)
    expect(bankAccountDetails.sortCode).to.equal(processedSortCodeWithHyphens)
  })

  it('should construct a domain object given a sort code with hyphens and spaces', function () {
    var sortCodeWithHyphensAndSpaces = '12 - 12 - 12'
    var processedSortCodeWithHyphensAndSpaces = '121212'
    bankAccountDetails = new BankAccountDetails(VALID_ACCOUNT_NUMBER, sortCodeWithHyphensAndSpaces, VALID_NAME_ON_ACCOUNT, VALID_ROLL_NUMBER)
    expect(bankAccountDetails.accountNumber).to.equal(PROCESSED_ACCOUNT_NUMBER)
    expect(bankAccountDetails.sortCode).to.equal(processedSortCodeWithHyphensAndSpaces)
  })

  it('should throw a ValidationError if given empty strings', function () {
    expect(function () {
      new BankAccountDetails('', '', '')
    }).to.throw()
  })

  it('should throw a ValidationError if given letters', function () {
    expect(function () {
      new BankAccountDetails('asdf', 'asdf', VALID_NAME_ON_ACCOUNT, VALID_ROLL_NUMBER)
    }).to.throw()
  })

  it('should throw a ValidationError if given invalid length inputs', function () {
    expect(function () {
      new BankAccountDetails('123456789', '123', VALID_NAME_ON_ACCOUNT, VALID_ROLL_NUMBER)
    }).to.throw()
  })

  it('should throw a ValidationError if given invalid name on account length', function () {
    expect(function () {
      new BankAccountDetails('12345678', '123456', 'ztEHgAjGtoMIWQUmeFQRlDmrklPGpSPiLUYpenFuyeVoaAbxENBeWXdhkEmujscmMSWJreKJrzawFgEpUWxrHeQRnMVdbOVejsOcw', '123456789012345678')
    }).to.throw()
  })

  it('should throw a ValidationError if given invalid roll number length', function () {
    expect(function () {
      new BankAccountDetails('12345678', '123456', VALID_NAME_ON_ACCOUNT, '1234567890123456789')
    }).to.throw()
  })

  it('should throw a ValidationError if roll number contains invalid characters', function () {
    expect(function () {
      new BankAccountDetails('12345678', '123456', VALID_NAME_ON_ACCOUNT, 'ABEY%HT26a')
    }).to.throw()
  })
})
