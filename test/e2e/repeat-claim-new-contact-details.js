const internalEligibilityHelper = require('../helpers/data/internal/internal-eligibility-helper')
const internalVisitorHelper = require('../helpers/data/internal/internal-visitor-helper')
const dateFormatter = require('../../app/services/date-formatter')
const referenceGenerator = require('../../app/services/reference-generator')

var todaysDate = dateFormatter.now()
describe('Repeat claim with new contact details', function () {
  const REFERENCE = referenceGenerator.generate()

  before(function () {
    return internalEligibilityHelper.insertEligibilityAndClaim(REFERENCE)
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
      .waitForExist('#new-claim')
      .click('#new-claim')

      // Check your information
      .waitForExist('#continue')
      .click('#change-contact-details')

      // Change contact details
      .waitForExist('#submit')
      .setValue('#email-address', 'donotsend@apvs.com')
      .setValue('#phone-number', '9876543210')
      .click('#submit')

      // Check your information
      .waitForExist('#continue')
      .click('[for="confirm-correct"]')
      .click('#continue')

      // Future or past visit
      .waitForExist('#future-or-past-submit')
      .click('[for="past"]')
      .click('#future-or-past-submit')

      // Same journey as your last claim
      .waitForExist('#same-journey-as-last-claim-submit')
      .click('[for="no"]')
      .click('#same-journey-as-last-claim-submit')

      // Journey information
      .waitForExist('#journey-information-submit')
      .setValue('#date-of-journey-day', todaysDate.date())
      .setValue('#date-of-journey-month', todaysDate.month() + 1)
      .setValue('#date-of-journey-year', todaysDate.year())
      .click('#journey-information-submit')

      // Has Escort
      .waitForExist('#has-escort-submit')
      .click('[for="escort-no"]')
      .click('#has-escort-submit')

      // Has Child
      .waitForExist('#has-child-submit')
      .click('[for="child-no"]')
      .click('#has-child-submit')

      // Expense
      .waitForExist('#expenses-submit')
      .click('[for="bus"]')
      .click('#expenses-submit')

      // Bus #1 (adult expense)
      .waitForExist('#bus-details-submit')
      .setValue('#from-input', 'Euston')
      .setValue('#to-input', 'Birmingham New Street')
      .click('[for="return-no"]')
      .setValue('#cost-input', '20')
      .click('#bus-details-submit')

      // Claim summary
      .waitForExist('#claim-summary-submit')
      .click('#add-visit-confirmation')

      // Upload visit confirmation
      .waitForExist('#Post')
      .click('[for="Post"]')
      .click('#file-upload-submit')

      // Claim summary
      .waitForExist('#claim-summary-submit')
      .click('.add-expense-receipt')

      // Upload Receipt Bus Adult
      .waitForExist('#Post')
      .click('[for="Post"]')
      .click('#file-upload-submit')

      // Claim summary
      .waitForExist('#claim-summary-submit')
      .click('#claim-summary-submit')

      // Bank account details
      .waitForExist('#bank-account-details-submit')
      .setValue('#account-number-input', '00123456')
      .setValue('#sort-code-input', '001122')
      .click('[for="terms-and-conditions-input"]')
      .click('#bank-account-details-submit')

      // Application submitted
      .waitForExist('#reference')
  })

  after(function () {
    return internalEligibilityHelper.deleteAll(REFERENCE)
  })
})
