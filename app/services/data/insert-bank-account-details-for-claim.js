const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const PaymentDetails = require('../domain/payment-details')

module.exports = function (reference, eligibilityId, claimId, bankAccountDetails) {
  if (!(bankAccountDetails instanceof PaymentDetails)) {
    throw new Error('Provided bankAccountDetails object is not an instance of the expected class')
  }
  return knex('ClaimBankDetail').insert({
    EligibilityId: eligibilityId,
    Reference: reference,
    ClaimId: claimId,
    AccountNumber: bankAccountDetails.accountNumber,
    SortCode: bankAccountDetails.sortCode
  })
}
