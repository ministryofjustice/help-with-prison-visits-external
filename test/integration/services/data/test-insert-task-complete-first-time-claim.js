const expect = require('chai').expect
const taskHelper = require('../../../helpers/data/task-helper')
const insertTask = require('../../../../app/services/data/insert-task-complete-first-time-claim')
const dateFormatter = require('../../../../app/services/date-formatter')

describe('services/data/insert-task-complete-first-time-claim', function () {
  const REFERENCE = 'COMFTC1'
  const ELIGIBILITYID = 1234
  const CLAIM_ID = 124

  it('should insert a new task to complete the first time claim', function () {
    return insertTask(REFERENCE, ELIGIBILITYID, CLAIM_ID)
      .then(function () {
        return taskHelper.get(REFERENCE, CLAIM_ID)
      })
      .then(function (task) {
        expect(task.Task).to.equal(taskHelper.TASK)
        expect(task.Reference).to.equal(REFERENCE)
        expect(task.EligibilityId).to.equal(ELIGIBILITYID)
        expect(task.ClaimId).to.equal(CLAIM_ID)
        expect(task.DateCreated).to.be.within(
          dateFormatter.now().add(-2, 'minutes').toDate(),
          dateFormatter.now().add(2, 'minutes').toDate())
        expect(task.Status).to.equal(taskHelper.STATUS)
      })
  })

  after(function () {
    return taskHelper.delete(REFERENCE)
  })
})
