const config = require('../../../knexfile').migrations
const knex = require('knex')(config)
const tasksEnum = require('../../../app/constants/tasks-enum')
const taskStatusEnum = require('../../../app/constants/task-status-enum')
const insertTask = require('../../../app/services/data/insert-task-complete-first-time-claim')

module.exports.TASK = tasksEnum.COMPLETE_FIRST_TIME_CLAIM
module.exports.ADDITONAL_DATA = 'Smith'
module.exports.STATUS = taskStatusEnum.PENDING

module.exports.insert = function (reference, claimId) {
  return insertTask(reference, claimId)
}

module.exports.get = function (reference, claimId) {
  return knex.first()
    .from('ExtSchema.Task')
    .where({
      Reference: reference,
      ClaimId: claimId
    })
}

module.exports.delete = function (reference, claimId) {
  return knex.select()
    .from('ExtSchema.Task')
    .where({
      Reference: reference,
      ClaimId: claimId
    })
    .del()
}
