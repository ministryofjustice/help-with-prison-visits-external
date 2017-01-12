const internalEligibilityHelper = require('../helpers/data/internal/internal-eligibility-helper')
const referenceHelper = require('../helpers/e2e/reference-helper')
const dateFormatter = require('../../app/services/date-formatter')

var todaysDate = dateFormatter.now()
describe('First Time Claim Flow', () => {
  // The reference will be generated as part of this flow. So capture it once it is generated.
  var reference

  it('should display each page in the first time eligibility flow', () => {
    return browser.url('/')

      // Index
      .waitForExist('#start')
      .click('#start')

      // Start
      .waitForExist('#start-submit')
      .click('[for="no"]')
      .click('#start-submit')

      // Date of birth
      .waitForExist('#date-of-birth-submit')
      .setValue('#dob-day-input', '01')
      .setValue('#dob-month-input', '05')
      .setValue('#dob-year-input', '1955')
      .click('#date-of-birth-submit')

      // Prisoner relationship
      .waitForExist('#prisoner-relationship-submit')
      .click('[for="partner"]')
      .click('#prisoner-relationship-submit')

      // Benefit
      .waitForExist('#benefit-submit')
      .click('[for="income-support"]')
      .click('#benefit-submit')

      // About the Prisoner
      .waitForExist('#about-the-prisoner-submit')
      .setValue('#prisoner-first-name', 'Martin')
      .setValue('#prisoner-last-name', 'O\'Hara')
      .setValue('#dob-day', '01')
      .setValue('#dob-month', '05')
      .setValue('#dob-year', '1955')
      .setValue('#prisoner-number', 'A1234BC')
      .setValue('#prison-name-text-input', 'Maghaberry')
      .click('#NameOfPrison') // click label to remove input focus
      .click('#about-the-prisoner-submit')

      // About you
      .waitForExist('#about-you-submit')

      // Capture the reference.
      .getUrl().then(function (url) {
        reference = referenceHelper.extractReference(url)
      })

      .setValue('#first-name-input', 'Mary')
      .setValue('#last-name-input', 'O\'Hara')
      .setValue('#national-insurance-number-input', 'AA123456A')
      .setValue('#house-number-and-street-input', '1')
      .setValue('#town-input', 'Town')
      .setValue('#county-input', 'County')
      .setValue('#post-code-input', 'AA123AA')
      .selectByVisibleText('#country-input', 'Northern Ireland')
      .setValue('#email-address-input', 'donotsend@apvs.com')
      .setValue('#phone-number-input', '0123456789')
      .click('#about-you-submit')

      // Journey information - NI claims skip Future or past visit
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
      .click('[for="car-only"]')
      .click('#expenses-submit')

      // Car
      .waitForExist('#car-details-submit')
      .click('#car-details-submit')

      // Claim summary
      .waitForExist('#claim-summary-submit')
      .click('#add-visit-confirmation')

      // Upload visit confirmation
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
    return internalEligibilityHelper.deleteAll(reference)
  })
})
