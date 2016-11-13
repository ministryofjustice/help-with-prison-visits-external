const expect = require('chai').expect
const config = require('../../../../knexfile').migrations
const knex = require('knex')(config)
const dateFormatter = require('../../../../app/services/date-formatter')
const tasksEnum = require('../../../../app/constants/tasks-enum')
const taskStatusEnum = require('../../../../app/constants/task-status-enum')
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const visitorHelper = require('../../../helpers/data/visitor-helper')

const insertTaskSendFirstTimeClaimNotification = require('../../../../app/services/data/insert-task-send-first-time-claim-notification')

const reference = 'S123456'
var eligibilityId
var claimId = 123

describe('services/data/insert-task-send-first-time-claim-notification', function () {
  before(function () {
    return eligiblityHelper.insertEligibilityVisitorAndPrisoner(reference)
      .then(function (newEligibilityId) {
        eligibilityId = newEligibilityId
      })
  })

  it('should insert a new task to send the first time claim notification', function () {
    return insertTaskSendFirstTimeClaimNotification(reference, eligibilityId, claimId)
      .then(function () {
        return knex.first().from('ExtSchema.Task').where({Reference: reference, ClaimId: claimId})
          .then(function (task) {
            expect(task.Task).to.equal(tasksEnum.FIRST_TIME_CLAIM_NOTIFICATION)
            expect(task.Reference).to.equal(reference)
            expect(task.EligibilityId).to.equal(eligibilityId)
            expect(task.ClaimId).to.equal(claimId)
            expect(task.AdditionalData).to.equal(visitorHelper.EMAIL_ADDRESS)
            expect(task.DateCreated).to.be.within(
              dateFormatter.now().add(-2, 'minutes').toDate(),
              dateFormatter.now().add(2, 'minutes').toDate()
            )
            expect(task.Status).to.equal(taskStatusEnum.PENDING)
          })
      })
  })

  after(function () {
    return eligiblityHelper.deleteAll(reference)
  })
})
