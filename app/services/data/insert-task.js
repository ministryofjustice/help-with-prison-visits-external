const { getDatabaseConnector } = require('../../databaseConnector')
const taskStatusEnum = require('../../constants/task-status-enum')
const dateFormatter = require('../date-formatter')

module.exports = function (reference, eligibilityId, claimId, taskType, additionalData, setTaskStatus) {
  const db = getDatabaseConnector()

  return db('Task').insert({
    Task: taskType,
    Reference: reference,
    EligibilityId: eligibilityId,
    ClaimId: claimId,
    AdditionalData: additionalData,
    DateCreated: dateFormatter.now().toDate(),
    Status: (!setTaskStatus) ? taskStatusEnum.PENDING : setTaskStatus // only set task status in e2e tests
  })
}
