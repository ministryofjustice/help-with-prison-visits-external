const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const tasksEnum = require('../../constants/tasks-enum')
const taskStatusEnum = require('../../constants/task-status-enum')
const dateFormatter = require('../date-formatter')

module.exports = function (reference, eligibilityId, claimId) {
  return knex('Task').insert({
    Task: tasksEnum.COMPLETE_FIRST_TIME_CLAIM,
    Reference: reference,
    EligibilityId: eligibilityId,
    ClaimId: claimId,
    DateCreated: dateFormatter.now().toDate(),
    Status: taskStatusEnum.PENDING
  })
}
