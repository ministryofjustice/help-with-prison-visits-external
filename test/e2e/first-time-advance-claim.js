const internalEligibilityHelper = require('../helpers/data/internal/internal-eligibility-helper')
const referenceHelper = require('../helpers/e2e/reference-helper')
const dateFormatter = require('../../app/services/date-formatter')

var futureDate = dateFormatter.now().add(14, 'days')
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
      .setValue('#prisoner-first-name', 'Joe')
      .setValue('#prisoner-last-name', 'Bloggs')
      .setValue('#dob-day', '01')
      .setValue('#dob-month', '05')
      .setValue('#dob-year', '1955')
      .setValue('#prisoner-number', 'A1234BC')
      .setValue('#prison-name-text-input', 'Hewell')
      .click('#NameOfPrison') // click label to remove input focus
      .click('#about-the-prisoner-submit')

      // About you
      .waitForExist('#about-you-submit')

      // Capture the reference.
      .getUrl().then(function (url) {
        reference = referenceHelper.extractReference(url)
      })

      .setValue('#first-name-input', 'Joe')
      .setValue('#last-name-input', 'Bloggs')
      .setValue('#national-insurance-number-input', 'AA123456A')
      .setValue('#house-number-and-street-input', '1')
      .setValue('#town-input', 'Town')
      .setValue('#county-input', 'County')
      .setValue('#post-code-input', 'AA123AA')
      .selectByVisibleText('#country-input', 'Northern Ireland')
      .setValue('#email-address-input', 'donotsend@apvs.com')
      .setValue('#phone-number-input', '0123456789')
      .click('#about-you-submit')

      // Future or past visit
      .waitForExist('#future-or-past-submit')
      .click('[for="advance"]')
      .click('#future-or-past-submit')

      // Journey information
      .waitForExist('#journey-information-submit')
      .setValue('#date-of-journey-day', futureDate.date())
      .setValue('#date-of-journey-month', futureDate.month() + 1)
      .setValue('#date-of-journey-year', futureDate.year())
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

      // Bus
      .waitForExist('#bus-details-submit')
      .setValue('#from-input', 'Euston')
      .setValue('#to-input', 'Birmingham New Street')
      .click('[for="return-no"]')
      .setValue('#cost-input', '20')
      .click('#bus-details-submit')

      // Claim summary (advance claims do not need visit confirmation/expense upload)
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
