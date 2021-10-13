const { getDatabaseConnector } = require('../../../app/databaseConnector')
const insertBankAccountDetailsForClaim = require('../../../app/services/data/insert-bank-account-details-for-claim')
const BankAccountDetails = require('../../../app/services/domain/bank-account-details')

module.exports.ACCOUNT_NUMBER = '07526415'
module.exports.SORT_CODE = '010203'
module.exports.NAME_ON_ACCOUNT = 'MR JOSEPH BLOGGS'
module.exports.ROLL_NUMBER = 'ADGV-36453.89B'

module.exports.build = function () {
  return new BankAccountDetails(
    this.ACCOUNT_NUMBER,
    this.SORT_CODE,
    this.NAME_ON_ACCOUNT,
    this.ROLL_NUMBER
  )
}

module.exports.insert = function (claimId) {
  return insertBankAccountDetailsForClaim(claimId, this.build())
}

module.exports.get = function (claimId) {
  const db = getDatabaseConnector()

  return db.first()
    .from('ExtSchema.ClaimBankDetail')
    .where('ClaimId', claimId)
}

module.exports.delete = function (claimId) {
  const db = getDatabaseConnector()

  return db.select()
    .from('ExtSchema.ClaimBankDetail')
    .where('ClaimId', claimId)
    .del()
}
