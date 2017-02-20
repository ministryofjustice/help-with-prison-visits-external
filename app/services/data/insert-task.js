const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const taskStatusEnum = require('../../constants/task-status-enum')
const dateFormatter = require('../date-formatter')

module.exports = function (reference, eligibilityId, claimId, taskType, additionalData, setTaskStatus) {
  return knex('Task').insert({
    Task: taskType,
    Reference: reference,
    EligibilityId: eligibilityId,
    ClaimId: claimId,
    AdditionalData: additionalData,
    DateCreated: dateFormatter.now().toDate(),
    Status: (!setTaskStatus) ? taskStatusEnum.PENDING : setTaskStatus // only set task status in e2e tests
  })
}
