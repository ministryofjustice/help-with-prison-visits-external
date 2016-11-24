const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const tasksEnum = require('../../constants/tasks-enum')
const insertTask = require('./insert-task')
const getRepeatEligibility = require('../get-repeat-eligibility')

module.exports = function (reference, eligibilityId, claimId) {
  return knex('Visitor')
    .where({'Reference': reference, 'EligibilityId': eligibilityId})
    .first('EmailAddress')
    .then(function (result) {
      if (result) {
        return insertTask(reference, eligibilityId, claimId, tasksEnum.SEND_CLAIM_NOTIFICATION, result.EmailAddress)
      } else {
        // Attempt to find contact details in Internal data for repeat claims
        return getRepeatEligibility(reference, null, eligibilityId)
          .then(function (result) {
            if (!result) {
              throw new Error('Could not find email address to send notification')
            }
            return insertTask(reference, eligibilityId, claimId, tasksEnum.SEND_CLAIM_NOTIFICATION, result.EmailAddress)
          })
      }
    })
}
