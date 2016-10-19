const expect = require('chai').expect
const BankAccountDetailsValidator = require('../../../../../app/services/validators/payment/bank-account-details-validator')

describe('services/validators/payment/bank-account-details-validator', function () {
  const VALID_DATA = {
    'AccountNumber': '12345678',
    'SortCode': '123456'
  }
  const INVALID_DATA = {
    'AccountNumber': '',
    'SortCode': ''
  }

  it('should throw error if data is null', function (done) {
    expect(function () {
      BankAccountDetailsValidator(null)
        .isRequired()
    }).to.throw(TypeError)
    done()
  })

  it('should throw error if data is undefined', function (done) {
    expect(function () {
      BankAccountDetailsValidator(undefined)
        .isRequired()
    }).to.throw(TypeError)
    done()
  })

  it('should throw error if data is an unexpected object', function (done) {
    expect(function () {
      BankAccountDetailsValidator({})
        .isRequired()
    }).to.throw(TypeError)
    done()
  })

  it('should return false if provided with valid data', function (done) {
    var errors = BankAccountDetailsValidator(VALID_DATA)
    expect(errors).to.equal(false)
    done()
  })

  it('should return an error object if provided with invalid data', function (done) {
    var errors = BankAccountDetailsValidator(INVALID_DATA)
    expect(errors).to.have.property('AccountNumber')
    done()
  })
})
