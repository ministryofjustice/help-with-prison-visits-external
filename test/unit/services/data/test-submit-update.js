const sinon = require('sinon')
const tasksEnum = require('../../../../app/constants/tasks-enum')
const BankAccountDetails = require('../../../../app/services/domain/bank-account-details')

const REFERENCE = 'V123456'
const ELIGIBILITYID = 1
const CLAIMID = 1
const BANK_DETAILS = { sortCode: '112233', accountNumber: '33445566', nameOnAccount: 'MR JOSEPH BLOGGS', rollNumber: '', required: true }
const TEST_BANK_ACCOUNT_DETAILS = new BankAccountDetails(BANK_DETAILS.accountNumber, BANK_DETAILS.sortCode, BANK_DETAILS.nameOnAccount, BANK_DETAILS.rollNumber, 'yes')
const NO_BANK_DETAILS = { required: false }

jest.mock('./insert-task', () => mockInsertTask)
jest.mock('./insert-bank-account-details-for-claim', () => insertBankDetailsStub)

describe('services/data/submit-update', function () {
  let submitUpdate
  let mockInsertTask
  let insertBankDetailsStub

  beforeAll(function () {
    mockInsertTask = jest.fn()
    insertBankDetailsStub = jest.fn()

    submitUpdate = require('../../../../app/services/data/submit-update')
  })

  it('should insert REQUEST_INFORMATION_RESPONSE task', function () {
    mockInsertTask.mockResolvedValue()
    return submitUpdate(REFERENCE, ELIGIBILITYID, CLAIMID, '', NO_BANK_DETAILS)
      .then(function () {
        expect(mockInsertTask.hasBeenCalledWith(REFERENCE, ELIGIBILITYID, CLAIMID, tasksEnum.REQUEST_INFORMATION_RESPONSE, '')).toBe(true)  //eslint-disable-line
        expect(insertBankDetailsStub.calledOnce).toBe(false)  //eslint-disable-line
      })
  })

  it('should insert bank details if they have been updated', function () {
    mockInsertTask.mockResolvedValue()
    insertBankDetailsStub.mockResolvedValue()
    return submitUpdate(REFERENCE, ELIGIBILITYID, CLAIMID, '', BANK_DETAILS)
      .then(function () {
        expect(mockInsertTask.hasBeenCalledWith(REFERENCE, ELIGIBILITYID, CLAIMID, tasksEnum.REQUEST_INFORMATION_RESPONSE, '')).toBe(true)  //eslint-disable-line
        expect(insertBankDetailsStub.hasBeenCalledWith(REFERENCE, ELIGIBILITYID, CLAIMID, TEST_BANK_ACCOUNT_DETAILS)).toBe(true)  //eslint-disable-line
      })
  })
})
