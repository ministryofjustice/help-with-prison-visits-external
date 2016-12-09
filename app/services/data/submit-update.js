const Promise = require('bluebird')
const insertTask = require('./insert-task')
const tasksEnum = require('../../constants/tasks-enum')
const getRepeatEligibility = require('./get-repeat-eligibility')

module.exports = function (reference, eligibilityId, claimId, message) {
  return Promise.all([
    insertTask(reference, eligibilityId, claimId, tasksEnum.REQUEST_INFORMATION_RESPONSE, message),
    insertTaskRequestInformationResponseSubmittedNotification(reference, eligibilityId, claimId)])
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
