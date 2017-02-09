const Promise = require('bluebird')
const insertTask = require('./insert-task')
const tasksEnum = require('../../constants/tasks-enum')
const insertBankDetails = require('./insert-bank-account-details-for-claim')
const BankAccountDetails = require('../domain/bank-account-details')

module.exports = function (reference, eligibilityId, claimId, message, bankDetails) {
  return insertBankDetailsIfRequired(reference, eligibilityId, claimId, bankDetails)
    .then(function () {
      return insertTask(reference, eligibilityId, claimId, tasksEnum.REQUEST_INFORMATION_RESPONSE, message)
    })
}

function insertBankDetailsIfRequired (reference, eligibilityId, claimId, bankDetails) {
  if (bankDetails.required) {
    var termsAcceptedForUpdate = 'yes'
    var bankAccountDetails = new BankAccountDetails(bankDetails.accountNumber, bankDetails.sortCode, termsAcceptedForUpdate)
    return insertBankDetails(reference, eligibilityId, claimId, bankAccountDetails)
  } else {
    return Promise.resolve()
  }
}
