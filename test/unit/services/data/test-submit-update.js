var expect = require('chai').expect
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')
const tasksEnum = require('../../../../app/constants/tasks-enum')
const BankAccountDetails = require('../../../../app/services/domain/bank-account-details')

const REPEAT_ELIGIBILITY = {EmailAddress: 'test@test.com'}
const REFERENCE = 'V123456'
const ELIGIBILITYID = 1
const CLAIMID = 1
const BANK_DETAILS = { sortCode: '112233', accountNumber: '33445566', required: true }
const TEST_BANK_ACCOUNT_DETAILS = new BankAccountDetails(BANK_DETAILS.accountNumber, BANK_DETAILS.sortCode, 'yes')
const NO_BANK_DETAILS = { required: false }

describe('services/data/submit-update', function () {
  var submitUpdate
  var getRepeatEligibilityStub
  var insertTaskStub
  var insertBankDetailsStub

  before(function () {
    getRepeatEligibilityStub = sinon.stub()
    insertTaskStub = sinon.stub()
    insertBankDetailsStub = sinon.stub()

    submitUpdate = proxyquire('../../../../app/services/data/submit-update', {
      './get-repeat-eligibility': getRepeatEligibilityStub,
      './insert-task': insertTaskStub,
      './insert-bank-account-details-for-claim': insertBankDetailsStub
    })
  })

  it('should insert two tasks and retrieve email address', function () {
    getRepeatEligibilityStub.resolves(REPEAT_ELIGIBILITY)
    insertTaskStub.resolves()
    return submitUpdate(REFERENCE, ELIGIBILITYID, CLAIMID, '', NO_BANK_DETAILS)
      .then(function () {
        expect(insertTaskStub.calledWith(REFERENCE, ELIGIBILITYID, CLAIMID, tasksEnum.REQUEST_INFORMATION_RESPONSE, '')).to.be.true
        expect(getRepeatEligibilityStub.calledWith(REFERENCE, null, ELIGIBILITYID)).to.be.true
        expect(insertTaskStub.calledWith(REFERENCE, ELIGIBILITYID, CLAIMID, tasksEnum.REQUEST_INFORMATION_RESPONSE_SUBMITTED_NOTIFICATION, REPEAT_ELIGIBILITY.EmailAddress)).to.be.true
        expect(insertBankDetailsStub.calledOnce).to.be.false
      })
  })

  it('should insert bank details if they have been updated', function () {
    getRepeatEligibilityStub.resolves(REPEAT_ELIGIBILITY)
    insertTaskStub.resolves()
    return submitUpdate(REFERENCE, ELIGIBILITYID, CLAIMID, '', BANK_DETAILS)
      .then(function () {
        expect(insertTaskStub.calledWith(REFERENCE, ELIGIBILITYID, CLAIMID, tasksEnum.REQUEST_INFORMATION_RESPONSE, '')).to.be.true
        expect(getRepeatEligibilityStub.calledWith(REFERENCE, null, ELIGIBILITYID)).to.be.true
        expect(insertTaskStub.calledWith(REFERENCE, ELIGIBILITYID, CLAIMID, tasksEnum.REQUEST_INFORMATION_RESPONSE_SUBMITTED_NOTIFICATION, REPEAT_ELIGIBILITY.EmailAddress)).to.be.true
        expect(insertBankDetailsStub.calledWith(REFERENCE, ELIGIBILITYID, CLAIMID, TEST_BANK_ACCOUNT_DETAILS)).to.be.true
      })
  })

  it('should throw an error when no email address exists', function () {
    getRepeatEligibilityStub.resolves({})
    insertTaskStub.resolves()
    return submitUpdate(REFERENCE, ELIGIBILITYID, CLAIMID, '', NO_BANK_DETAILS)
      .then(function () {
        expect(insertTaskStub.calledWith(REFERENCE, ELIGIBILITYID, CLAIMID, tasksEnum.REQUEST_INFORMATION_RESPONSE, '')).to.be.true
      })
      .catch(function (error) {
        expect(error).to.be.equal('Could not find email address to send notification')
      })
  })
})
