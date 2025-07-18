const { expect } = require('chai')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const { getDatabaseConnector } = require('../../../../app/databaseConnector')
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const tasksEnum = require('../../../../app/constants/tasks-enum')
const eligibilityStatusEnum = require('../../../../app/constants/eligibility-status-enum')
const claimStatusEnum = require('../../../../app/constants/claim-status-enum')
const dateFormatter = require('../../../../app/services/date-formatter')

const REFERENCE = 'SUBMITF'
const CLAIM_TYPE = 'first-time'
let eligibilityId
let claimId

const stubInsertTask = sinon.stub().resolves()

const submitClaim = proxyquire('../../../../app/services/data/submit-claim', {
  './insert-task': stubInsertTask,
})

describe('services/data/submit-claim', () => {
  before(() => {
    return eligiblityHelper.insertEligibilityClaim(REFERENCE).then(function (ids) {
      eligibilityId = ids.eligibilityId
      claimId = ids.claimId
    })
  })

  it('should update Eligibility/Claim Status, DateSubmitted and insert tasks', () => {
    const currentDate = dateFormatter.now()
    const twoMinutesAgo = dateFormatter.now().minutes(currentDate.get('minutes') - 2)
    const twoMinutesAhead = dateFormatter.now().minutes(currentDate.get('minutes') + 2)
    const assistedDigitalCaseworker = 'a@b.com'
    const paymentMethod = 'bank'

    return submitClaim(REFERENCE, eligibilityId, claimId, CLAIM_TYPE, assistedDigitalCaseworker, paymentMethod).then(
      () => {
        const db = getDatabaseConnector()

        return db
          .first()
          .from('ExtSchema.Eligibility')
          .where('Reference', REFERENCE)
          .then(eligibility => {
            return db
              .first()
              .from('ExtSchema.Claim')
              .where('Reference', REFERENCE)
              .then(claim => {
                expect(eligibility.Status).to.equal(eligibilityStatusEnum.SUBMITTED)
                expect(eligibility.DateSubmitted).to.be.within(twoMinutesAgo.toDate(), twoMinutesAhead.toDate())

                expect(claim.Status).to.equal(claimStatusEnum.SUBMITTED)
                expect(claim.AssistedDigitalCaseworker).to.equal(assistedDigitalCaseworker)
                expect(claim.DateSubmitted).to.be.within(twoMinutesAgo.toDate(), twoMinutesAhead.toDate())
                expect(claim.PaymentMethod).to.equal(paymentMethod)

                expect(stubInsertTask.calledWith(REFERENCE, eligibilityId, claimId, tasksEnum.COMPLETE_CLAIM, CLAIM_TYPE)).to.be.true  //eslint-disable-line
              })
          })
      },
    )
  })

  it('should throw an error if no valid claim', () => {
    return submitClaim('NONE123', 4321, 123456, CLAIM_TYPE, undefined).catch(error => {
      expect(error.message).to.contain('Could not find Claim')
    })
  })

  after(() => {
    return eligiblityHelper.deleteAll(REFERENCE)
  })
})
