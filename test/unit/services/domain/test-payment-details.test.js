/* eslint-disable no-new */
const PaymentDetails = require('../../../../app/services/domain/payment-details')

let paymentDetails

describe('services/domain/payment-details', () => {
  const VALID_PAYMENT_BANK = 'bank'
  const VALID_PAYMENT_PAYOUT = 'payout'

  it('should construct a domain object given valid input', () => {
    paymentDetails = new PaymentDetails(VALID_PAYMENT_BANK)
    expect(paymentDetails.paymentMethod).toBe(VALID_PAYMENT_BANK)
  })

  it('should construct a domain object given valid input for payout ignoring invalid bank account details', () => {
    paymentDetails = new PaymentDetails(VALID_PAYMENT_PAYOUT)
    expect(paymentDetails.paymentMethod).toBe(VALID_PAYMENT_PAYOUT)
  })

  it('should throw a ValidationError if given empty strings', () => {
    expect(() => {
      new PaymentDetails('')
    }).toThrow()
  })
})
