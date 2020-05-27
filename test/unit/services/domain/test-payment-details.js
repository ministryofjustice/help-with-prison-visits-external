/* eslint-disable no-new */
const PaymentDetails = require('../../../../app/services/domain/payment-details')
const expect = require('chai').expect

var paymentDetails

describe('services/domain/payment-details', function () {
  const VALID_PAYMENT_BANK = 'bank'
  const VALID_PAYMENT_PAYOUT = 'payout'

  it('should construct a domain object given valid input', function () {
    paymentDetails = new PaymentDetails(VALID_PAYMENT_BANK)
    expect(paymentDetails.paymentMethod).to.equal(VALID_PAYMENT_BANK)
  })

  it('should construct a domain object given valid input for payout ignoring invalid bank account details', function () {
    paymentDetails = new PaymentDetails(VALID_PAYMENT_PAYOUT)
    expect(paymentDetails.paymentMethod).to.equal(VALID_PAYMENT_PAYOUT)
  })

  it('should throw a ValidationError if given empty strings', function () {
    expect(function () {
      new PaymentDetails('')
    }).to.throw()
  })
})
