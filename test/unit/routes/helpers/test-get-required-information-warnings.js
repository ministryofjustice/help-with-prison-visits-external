const addInformationHelper = require('../../../../app/routes/helpers/get-required-information-warnings')

const REQUIRED_STATUS = 'REQUEST-INFORMATION'
const FROM_INTERNAL_WEB = true
const REQUIRED_DOCUMENT_STATUS = { DocumentStatus: 'upload-later', fromInternalWeb: FROM_INTERNAL_WEB }
const EXPENSES_TO_BE_ADDED = [{ Status: REQUIRED_STATUS, fromInternalWeb: FROM_INTERNAL_WEB }, { Status: REQUIRED_STATUS, fromInternalWeb: true }]
const BANK_DETAILS_TO_BE_ADDED = true

const NOT_FROM_INTERNAL = false
const OTHER_STATUS = 'APPROVED'
const OTHER_DOCUMENT_STATUS = { DocumentStatus: 'uploaded', fromInternalWeb: FROM_INTERNAL_WEB }
const EXPENSES_NOT_ADDED = [{ Status: OTHER_STATUS, fromInternalWeb: NOT_FROM_INTERNAL }]
const NO_BANK_DETAILS = false

describe('routes/helpers/get-required-information-warnings', function () {
  it('should return an empty array for no information required', function () {
    const result = addInformationHelper(OTHER_STATUS, OTHER_STATUS, OTHER_DOCUMENT_STATUS, OTHER_STATUS, OTHER_DOCUMENT_STATUS, EXPENSES_NOT_ADDED, NO_BANK_DETAILS)
    expect(result.length).toBe(0)
  })

  it('should return a information about viewing messages', function () {
    const result = addInformationHelper(REQUIRED_STATUS, OTHER_STATUS, OTHER_DOCUMENT_STATUS, OTHER_STATUS, OTHER_DOCUMENT_STATUS, EXPENSES_NOT_ADDED, NO_BANK_DETAILS)
    expect(result[0].field).toBe('messages')
  })

  it('should return an a benefit information required messages', function () {
    const resultStatus = addInformationHelper(OTHER_STATUS, REQUIRED_STATUS, OTHER_DOCUMENT_STATUS, OTHER_STATUS, OTHER_DOCUMENT_STATUS, EXPENSES_NOT_ADDED, NO_BANK_DETAILS)
    const resultDocument = addInformationHelper(OTHER_STATUS, OTHER_STATUS, REQUIRED_DOCUMENT_STATUS, OTHER_STATUS, OTHER_DOCUMENT_STATUS, EXPENSES_NOT_ADDED, NO_BANK_DETAILS)
    expect(resultStatus[0].field).toBe('benefit-information')
    expect(resultDocument[0].field).toBe('benefit-information')
  })

  it('should return a visit confirmation information required messages', function () {
    const resultStatus = addInformationHelper(OTHER_STATUS, OTHER_STATUS, OTHER_DOCUMENT_STATUS, REQUIRED_STATUS, OTHER_DOCUMENT_STATUS, EXPENSES_NOT_ADDED, NO_BANK_DETAILS)
    const resultDocument = addInformationHelper(OTHER_STATUS, OTHER_STATUS, OTHER_DOCUMENT_STATUS, OTHER_STATUS, REQUIRED_DOCUMENT_STATUS, EXPENSES_NOT_ADDED, NO_BANK_DETAILS)
    expect(resultStatus[0].field).toBe('VisitConfirmation')
    expect(resultDocument[0].field).toBe('VisitConfirmation')
  })

  it('should return an expenses information required message', function () {
    const result = addInformationHelper(OTHER_STATUS, OTHER_STATUS, OTHER_DOCUMENT_STATUS, OTHER_STATUS, OTHER_DOCUMENT_STATUS, EXPENSES_TO_BE_ADDED, NO_BANK_DETAILS)
    expect(result[0].field).toBe('claim-expense')
  })

  it('should return a bank details are needed message', function () {
    const result = addInformationHelper(OTHER_STATUS, OTHER_STATUS, OTHER_DOCUMENT_STATUS, OTHER_STATUS, OTHER_DOCUMENT_STATUS, EXPENSES_NOT_ADDED, BANK_DETAILS_TO_BE_ADDED)
    expect(result[0].field).toBe('bank-details')
  })
})
