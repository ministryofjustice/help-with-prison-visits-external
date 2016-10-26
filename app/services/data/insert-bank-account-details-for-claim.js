const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

module.export = function (claimId, bankDetailsDetails) {
  return knex('ClaimBankDetail').insert({
    ClaimId: claimId,
    AccountNumber: bankDetailsDetails.AccountNumber,
    SortCode: bankDetailsDetails.SortCode
  })
}
