const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const BankAccountDetails = require('../domain/bank-account-details')

module.exports = function (claimId, bankAccountDetails) {
  if (!(bankAccountDetails instanceof BankAccountDetails)) {
    throw new Error('Provided bankAccountDetails object is not an instance of the expected class')
  }
  return knex('ClaimBankDetail').insert({
    ClaimId: claimId,
    AccountNumber: bankAccountDetails.accountNumber,
    SortCode: bankAccountDetails.sortCode
  })
}
