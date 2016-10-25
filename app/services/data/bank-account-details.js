const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

module.exports.insert = function (claimId, bankDetailsDetails) {
  return knex('ClaimBankDetail').insert({
    ClaimId: claimId,
    AccountNumber: bankDetailsDetails.AccountNumber,
    SortCode: bankDetailsDetails.SortCode
  })
}
