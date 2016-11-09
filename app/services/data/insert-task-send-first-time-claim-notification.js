const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const tasksEnum = require('../../constants/tasks-enum')
const taskStatusEnum = require('../../constants/task-status-enum')
const dateFormatter = require('../date-formatter')

module.exports = function (reference, claimId) {
  return knex('Visitor').where('Reference', reference).first('EmailAddress').then(function (result) {
    var emailAddress = result.EmailAddress

    return knex('Task').insert({
      Task: tasksEnum.FIRST_TIME_CLAIM_NOTIFICATION,
      Reference: reference,
      ClaimId: claimId,
      AdditionalData: emailAddress,
      DateCreated: dateFormatter.now().toDate(),
      Status: taskStatusEnum.PENDING
    })
  })
}
