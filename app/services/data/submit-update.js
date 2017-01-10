const Promise = require('bluebird')
const insertTask = require('./insert-task')
const tasksEnum = require('../../constants/tasks-enum')
const getRepeatEligibility = require('./get-repeat-eligibility')
const insertBankDetails = require('./insert-bank-account-details-for-claim')
const BankAccountDetails = require('../domain/bank-account-details')

module.exports = function (reference, eligibilityId, claimId, message, bankDetails) {
  var tasks = [
    insertTask(reference, eligibilityId, claimId, tasksEnum.REQUEST_INFORMATION_RESPONSE, message),
    insertTaskRequestInformationResponseSubmittedNotification(reference, eligibilityId, claimId)
  ]

  if (bankDetails.required) {
    var termsAcceptedForUpdate = 'yes'
    var bankAccountDetails = new BankAccountDetails(bankDetails.accountNumber, bankDetails.sortCode, termsAcceptedForUpdate)
    tasks.push(insertBankDetails(reference, eligibilityId, claimId, bankAccountDetails))
  }

  return Promise.all(tasks)
}

function insertTaskRequestInformationResponseSubmittedNotification (reference, eligibilityId, claimId) {
  return getRepeatEligibility(reference, null, eligibilityId)
    .then(function (result) {
      if (!result) {
        throw new Error('Could not find email address to send notification')
      }
      return insertTask(reference, eligibilityId, claimId, tasksEnum.REQUEST_INFORMATION_RESPONSE_SUBMITTED_NOTIFICATION, result.EmailAddress)
    })
}
