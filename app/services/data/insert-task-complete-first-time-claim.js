const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const moment = require('moment')
const tasksEnum = require('../../constants/tasks-enum')
const taskStatusEnum = require('../../constants/task-status-enum')

module.exports = function (reference, claimId) {
  return knex('Task').insert({
    Task: tasksEnum.COMPLETE_FIRST_TIME_CLAIM,
    Reference: reference,
    ClaimId: claimId,
    DateCreated: moment().toDate(),
    Status: taskStatusEnum.PENDING
  })
}
