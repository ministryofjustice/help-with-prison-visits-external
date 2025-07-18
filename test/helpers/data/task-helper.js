const { getDatabaseConnector } = require('../../../app/databaseConnector')
const tasksEnum = require('../../../app/constants/tasks-enum')
const taskStatusEnum = require('../../../app/constants/task-status-enum')
const insertTask = require('../../../app/services/data/insert-task')

module.exports.TASK = tasksEnum.COMPLETE_CLAIM
module.exports.ADDITONAL_DATA = 'Smith'
module.exports.STATUS = taskStatusEnum.PENDING

module.exports.insert = (reference, claimId) => {
  return insertTask(reference, claimId, this.Task, this.ADDITONAL_DATA)
}

module.exports.get = (reference, claimId) => {
  const db = getDatabaseConnector()

  return db.first().from('ExtSchema.Task').where({
    Reference: reference,
    ClaimId: claimId,
  })
}

module.exports.delete = reference => {
  const db = getDatabaseConnector()

  return db.select().from('ExtSchema.Task').where('Reference', reference).del()
}
