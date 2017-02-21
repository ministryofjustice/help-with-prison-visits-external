var expect = require('chai').expect
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')
const tasksEnum = require('../../../../app/constants/tasks-enum')
const PaymentDetails = require('../../../../app/services/domain/payment-details')

const REFERENCE = 'V123456'
const ELIGIBILITYID = 1
const CLAIMID = 1
const BANK_DETAILS = { sortCode: '112233', accountNumber: '33445566', required: true }
const TEST_BANK_ACCOUNT_DETAILS = new PaymentDetails(BANK_DETAILS.accountNumber, BANK_DETAILS.sortCode, 'yes')
const NO_BANK_DETAILS = { required: false }

describe('services/data/submit-update', function () {
  var submitUpdate
  var insertTaskStub
  var insertBankDetailsStub

  before(function () {
    insertTaskStub = sinon.stub()
    insertBankDetailsStub = sinon.stub()

    submitUpdate = proxyquire('../../../../app/services/data/submit-update', {
      './insert-task': insertTaskStub,
      './insert-bank-account-details-for-claim': insertBankDetailsStub
    })
  })

  it('should insert REQUEST_INFORMATION_RESPONSE task', function () {
    insertTaskStub.resolves()
    return submitUpdate(REFERENCE, ELIGIBILITYID, CLAIMID, '', NO_BANK_DETAILS)
      .then(function () {
        expect(insertTaskStub.calledWith(REFERENCE, ELIGIBILITYID, CLAIMID, tasksEnum.REQUEST_INFORMATION_RESPONSE, '')).to.be.true
        expect(insertBankDetailsStub.calledOnce).to.be.false
      })
  })

  it('should insert bank details if they have been updated', function () {
    insertTaskStub.resolves()
    insertBankDetailsStub.resolves()
    return submitUpdate(REFERENCE, ELIGIBILITYID, CLAIMID, '', BANK_DETAILS)
      .then(function () {
        expect(insertTaskStub.calledWith(REFERENCE, ELIGIBILITYID, CLAIMID, tasksEnum.REQUEST_INFORMATION_RESPONSE, '')).to.be.true
        expect(insertBankDetailsStub.calledWith(REFERENCE, ELIGIBILITYID, CLAIMID, TEST_BANK_ACCOUNT_DETAILS)).to.be.true
      })
  })
})
