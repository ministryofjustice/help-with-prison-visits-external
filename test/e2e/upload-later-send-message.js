const internalEligibilityHelper = require('../helpers/data/internal/internal-eligibility-helper')
const internalVisitorHelper = require('../helpers/data/internal/internal-visitor-helper')
const referenceGenerator = require('../../app/services/reference-generator')

describe('Upload later and send a message', function () {
  const REFERENCE = referenceGenerator.generate()

  before(function () {
    return internalEligibilityHelper.insertEligibilityAndClaim(REFERENCE, 'PENDING')
  })

  it('should display each page in the repeat claim flow', function () {
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
      .waitForExist('#message-to-caseworker')
      .setValue('#message-to-caseworker', 'Sorry I have lost my bus receipt, is it ok to still approve my claim? I will post the other as soon as I can.')
      .click('#claim-view-submit')

      // Updated view claims page
      .waitForExist('#application-updated')
  })

  after(function () {
    return internalEligibilityHelper.deleteAll(REFERENCE)
  })
})
