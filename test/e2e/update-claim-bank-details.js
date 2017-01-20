const internalEligibilityHelper = require('../helpers/data/internal/internal-eligibility-helper')
const internalVisitorHelper = require('../helpers/data/internal/internal-visitor-helper')
const referenceGenerator = require('../../app/services/reference-generator')

describe('Claim payment information requested', function () {
  const REFERENCE = referenceGenerator.generate()

  before(function () {
    return internalEligibilityHelper.insertEligibilityAndClaim(REFERENCE, 'REQUEST-INFO-PAYMENT')
  })

  it('should display update bank details', function () {
    return browser.url('/')

      // Index
      .waitForExist('#start')
      .click('#start')

      // Start
      .waitForExist('#start-submit')
      .click('[for="yes"]')
      .click('#start-submit')

      // Start already registered
      .waitForExist('#already-registered-submit')
      .setValue('#reference', REFERENCE)
      .setValue('#dob-day-input', internalVisitorHelper.DAY)
      .setValue('#dob-month-input', internalVisitorHelper.MONTH)
      .setValue('#dob-year-input', internalVisitorHelper.YEAR)
      .click('#already-registered-submit')

      // Your Claims
      .waitForExist('#add-info')
      .click('#add-info')

      // Click to add visit confirmation
      .waitForExist('#update-visit-confirmation')
      .click('#update-visit-confirmation')

      // Post Later visit confirmation
      .waitForExist('#Post')
      .click('[for="Post"]')
      .click('#file-upload-submit')

      // Add message to claim and submit
      .waitForExist('#claim-view-submit')
      .setValue('#message-to-caseworker', 'Sorry about that, my bank account information has been corrected.')
      .setValue('#account-number-input', '11223344')
      .setValue('#sort-code-input', '223344')
      .click('#claim-view-submit')

      // Updated view claims page
      .waitForExist('#application-updated')
  })

  after(function () {
    return internalEligibilityHelper.deleteAll(REFERENCE)
  })
})
