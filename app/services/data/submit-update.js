const insertTask = require('./insert-task')
const tasksEnum = require('../../constants/tasks-enum')
const insertBankDetails = require('./insert-bank-account-details-for-claim')
const BankAccountDetails = require('../domain/bank-account-details')

module.exports = function (reference, eligibilityId, claimId, message, bankDetails, assistedDigitalCookie) {
  const setTaskStatus = assistedDigitalCookie === 'teste2e@test.com' ? 'TEST' : false // logic for e2e tests
  return insertBankDetailsIfRequired(reference, eligibilityId, claimId, bankDetails)
    .then(function () {
      return insertTask(reference, eligibilityId, claimId, tasksEnum.REQUEST_INFORMATION_RESPONSE, message, setTaskStatus)
    })
}

function insertBankDetailsIfRequired (reference, eligibilityId, claimId, bankDetails) {
  if (bankDetails.required) {
    const termsAcceptedForUpdate = 'yes'
    const bankAccountDetails = new BankAccountDetails(bankDetails.accountNumber, bankDetails.sortCode, bankDetails.nameOnAccount, bankDetails.rollNumber, termsAcceptedForUpdate)
    return insertBankDetails(reference, eligibilityId, claimId, bankAccountDetails)
  } else {
    return Promise.resolve()
  }
}
