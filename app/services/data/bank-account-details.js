const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

module.exports.insert = function (claimId, bankDetailsData) {
  return knex('ClaimBankDetail').insert({
    ClaimId: claimId,
    AccountNumber: bankDetailsData.AccountNumber.replace(/ /g, ''),
    SortCode: bankDetailsData.SortCode.replace(/ /g, '')
  })
}
