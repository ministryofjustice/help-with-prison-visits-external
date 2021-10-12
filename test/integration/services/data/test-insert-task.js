const expect = require('chai').expect
const { getDatabaseConnector } = require('../../../../app/databaseConnector')
const dateFormatter = require('../../../../app/services/date-formatter')
const taskStatusEnum = require('../../../../app/constants/task-status-enum')
const taskHelper = require('../../../helpers/data/task-helper')

const insertTask = require('../../../../app/services/data/insert-task')

const REFERENCE = 'S123456'
const TASKTYPE = 'TEST'
const ADDITIONAL_DATA = 'ADDITIONAL_DATA'
const eligibilityId = 321
const claimId = 123

describe('services/data/insert-task', function () {
  it('should insert a new task', function () {
    return insertTask(REFERENCE, eligibilityId, claimId, TASKTYPE, ADDITIONAL_DATA)
      .then(function () {
        const db = getDatabaseConnector()

        return db.first().from('ExtSchema.Task').where({ Reference: REFERENCE, ClaimId: claimId })
          .then(function (task) {
            expect(task.Task).to.equal(TASKTYPE)
            expect(task.Reference).to.equal(REFERENCE)
            expect(task.EligibilityId).to.equal(eligibilityId)
            expect(task.ClaimId).to.equal(claimId)
            expect(task.DateCreated).to.be.within(
              dateFormatter.now().add(-2, 'minutes').toDate(),
              dateFormatter.now().add(2, 'minutes').toDate()
            )
            expect(task.AdditionalData).to.equal(ADDITIONAL_DATA)
            expect(task.Status).to.equal(taskStatusEnum.PENDING)
          })
      })
  })

  after(function () {
    return taskHelper.delete(REFERENCE)
  })
})
