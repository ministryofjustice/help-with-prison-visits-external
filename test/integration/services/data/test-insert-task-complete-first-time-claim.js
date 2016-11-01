const expect = require('chai').expect
const config = require('../../../../knexfile').migrations
const knex = require('knex')(config)
const moment = require('moment')
const tasksEnum = require('../../../../app/constants/tasks-enum')
const taskStatusEnum = require('../../../../app/constants/task-status-enum')

const insertTaskCompleteFirstTimeClaim = require('../../../../app/services/data/insert-task-complete-first-time-claim')

const reference = 'COMFTC1'
var claimId = 124

describe('services/data/insert-task-complete-first-time-claim', function () {
  it('should insert a new task to complete the first time claim', function () {
    return insertTaskCompleteFirstTimeClaim(reference, claimId)
      .then(function () {
        return knex.first().from('ExtSchema.Task').where({Reference: reference, ClaimId: claimId})
          .then(function (task) {
            expect(task.Task).to.equal(tasksEnum.COMPLETE_FIRST_TIME_CLAIM)
            expect(task.Reference).to.equal(reference)
            expect(task.ClaimId).to.equal(claimId)
            expect(task.DateCreated).to.be.within(moment().add(-2, 'minutes').toDate(), moment().add(2, 'minutes').toDate())
            expect(task.Status).to.equal(taskStatusEnum.PENDING)
          })
      })
  })

  after(function () {
    return knex('ExtSchema.Task').where({Reference: reference, ClaimId: claimId}).del()
  })
})
