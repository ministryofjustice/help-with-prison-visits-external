const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const taskStatusEnum = require('../../constants/task-status-enum')
const dateFormatter = require('../date-formatter')

module.exports = function (reference, eligibilityId, claimId, taskType, additionalData) {
  return knex('Task').insert({
    Task: taskType,
    Reference: reference,
    EligibilityId: eligibilityId,
    ClaimId: claimId,
    AdditionalData: additionalData,
    DateCreated: dateFormatter.now().toDate(),
    Status: taskStatusEnum.PENDING
  })
}
