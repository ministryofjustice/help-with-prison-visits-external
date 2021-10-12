const { getDatabaseConnector } = require('../../databaseConnector')
const BankAccountDetails = require('../domain/bank-account-details')

module.exports = function (reference, eligibilityId, claimId, bankAccountDetails) {
  if (!(bankAccountDetails instanceof BankAccountDetails)) {
    throw new Error('Provided bankAccountDetails object is not an instance of the expected class')
  }

  const db = getDatabaseConnector()

  return db('ClaimBankDetail').insert({
    EligibilityId: eligibilityId,
    Reference: reference,
    ClaimId: claimId,
    AccountNumber: bankAccountDetails.accountNumber,
    SortCode: bankAccountDetails.sortCode,
    NameOnAccount: bankAccountDetails.nameOnAccount,
    RollNumber: bankAccountDetails.rollNumber
  })
}
