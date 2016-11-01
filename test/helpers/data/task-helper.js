const config = require('../../../knexfile').migrations
const knex = require('knex')(config)
const moment = require('moment')
const tasksEnum = require('../../../app/constants/tasks-enum')
const taskStatusEnum = require('../../../app/constants/task-status-enum')

module.exports.TASK = tasksEnum.COMPLETE_FIRST_TIME_CLAIM
module.exports.ADDITONAL_DATA = 'Smith'
module.exports.DATE_CREATED = moment().toDate()
module.exports.DATE_PROCESSED = moment().toDate()
module.exports.STATUS = taskStatusEnum.PENDING

module.exports.insert = function (reference, claimId) {
  return knex('ExtSchema.Task')
    .insert({
      Task: this.TASK,
      Reference: reference,
      ClaimId: claimId,
      AdditionalData: this.ADDITONAL_DATA,
      DateCreated: this.DATE_CREATED,
      DateProcessed: this.DATE_PROCESSED,
      Status: this.STATUS
    })
}

module.exports.get = function (reference, claimId) {
  return knex.select()
    .from('ExtSchema.Task')
    .where({
      Reference: reference,
      ClaimId: claimId
    })
    .then(function (result) {
      return result[0]
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
