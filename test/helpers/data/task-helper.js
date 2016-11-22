const config = require('../../../knexfile').migrations
const knex = require('knex')(config)
const tasksEnum = require('../../../app/constants/tasks-enum')
const taskStatusEnum = require('../../../app/constants/task-status-enum')
const insertTask = require('../../../app/services/data/insert-task')

module.exports.TASK = tasksEnum.COMPLETE_CLAIM
module.exports.ADDITONAL_DATA = 'Smith'
module.exports.STATUS = taskStatusEnum.PENDING

module.exports.insert = function (reference, claimId) {
  return insertTask(reference, claimId, this.Task, this.ADDITONAL_DATA)
}

module.exports.get = function (reference, claimId) {
  return knex.first()
    .from('ExtSchema.Task')
    .where({
      Reference: reference,
      ClaimId: claimId
    })
}

module.exports.delete = function (reference) {
  return knex.select()
    .from('ExtSchema.Task')
    .where('Reference', reference)
    .del()
}
