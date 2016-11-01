const config = require('../../../knexfile').migrations
const knex = require('knex')(config)
const insertBankAccountDetailsForClaim = require('../../../app/services/data/insert-bank-account-details-for-claim')
const BankAccountDetails = require('../../../app/services/domain/bank-account-details')

module.exports.ACCOUNT_NUMBER = '07526415'
module.exports.SORT_CODE = '010203'

module.exports.insert = function (claimId) {
  var bank = new BankAccountDetails(
    this.ACCOUNT_NUMBER,
    this.SORT_CODE
  )
  return insertBankAccountDetailsForClaim(claimId, bank)
}

module.exports.get = function (claimId) {
  return knex.first()
    .from('ExtSchema.ClaimBankDetail')
    .where('ClaimId', claimId)
}

module.exports.delete = function (claimId) {
  return knex.select()
    .from('ExtSchema.ClaimBankDetail')
    .where('ClaimId', claimId)
    .del()
}
