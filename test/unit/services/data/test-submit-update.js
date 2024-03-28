const tasksEnum = require('../../../../app/constants/tasks-enum')
const BankAccountDetails = require('../../../../app/services/domain/bank-account-details')

const REFERENCE = 'V123456'
const ELIGIBILITYID = 1
const CLAIMID = 1
const BANK_DETAILS = { sortCode: '112233', accountNumber: '33445566', nameOnAccount: 'MR JOSEPH BLOGGS', rollNumber: '', required: true }
const TEST_BANK_ACCOUNT_DETAILS = new BankAccountDetails(BANK_DETAILS.accountNumber, BANK_DETAILS.sortCode, BANK_DETAILS.nameOnAccount, BANK_DETAILS.rollNumber, 'yes')
const NO_BANK_DETAILS = { required: false }

describe('services/data/submit-update', function () {
  let submitUpdate
  const mockInsertTask = jest.fn()
  const mockInsertBankDetails = jest.fn()

  beforeEach(function () {
    jest.mock('../../../../app/services/data/insert-task', () => mockInsertTask)
    jest.mock('../../../../app/services/data/insert-bank-account-details-for-claim', () => mockInsertBankDetails)

    submitUpdate = require('../../../../app/services/data/submit-update')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should insert REQUEST_INFORMATION_RESPONSE task', function () {
    mockInsertTask.mockResolvedValue()
    return submitUpdate(REFERENCE, ELIGIBILITYID, CLAIMID, '', NO_BANK_DETAILS)
      .then(function () {
        expect(mockInsertTask).hasBeenCalledWith(REFERENCE, ELIGIBILITYID, CLAIMID, tasksEnum.REQUEST_INFORMATION_RESPONSE, '')  //eslint-disable-line
        expect(mockInsertBankDetails).not.hasBeenCalledWith()  //eslint-disable-line
      })
  })

  it('should insert bank details if they have been updated', function () {
    mockInsertTask.mockResolvedValue()
    mockInsertBankDetails.mockResolvedValue()
    return submitUpdate(REFERENCE, ELIGIBILITYID, CLAIMID, '', BANK_DETAILS)
      .then(function () {
        expect(mockInsertTask).hasBeenCalledWith(REFERENCE, ELIGIBILITYID, CLAIMID, tasksEnum.REQUEST_INFORMATION_RESPONSE, '')  //eslint-disable-line
        expect(mockInsertBankDetails).hasBeenCalledWith(REFERENCE, ELIGIBILITYID, CLAIMID, TEST_BANK_ACCOUNT_DETAILS)  //eslint-disable-line
      })
  })
})
