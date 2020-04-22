const internalEligibilityHelper = require('../helpers/data/internal/internal-eligibility-helper')
const claimHelper = require('../helpers/data/claim-helper')
const dateFormatter = require('../../app/services/date-formatter')
const path = require('path')

const TEST_FILE_PATH = path.join(__dirname, '..', 'resources', 'testfile.jpg')

var todaysDate = dateFormatter.now()
describe('First Time Claim Flow', () => {
  // The reference will be generated as part of this flow. So capture it once it is generated.
  var caseworker = 'teste2e@test.com'

  it('should display each page in the first time eligibility flow', () => {
    return browser.url('/assisted-digital?caseworker=teste2e@test.com')

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
      .click('[for="yes"]')
      .click('#benefit-submit')

      // About the Prisoner
      .waitForExist('#about-the-prisoner-submit')
      .setValue('#prisoner-first-name', 'Joe')
      .setValue('#prisoner-last-name', 'Bloggs')
      .setValue('#dob-day', '01')
      .setValue('#dob-month', '05')
      .setValue('#dob-year', '1955')
      .setValue('#prisoner-number', 'Z6541TS')
      .setValue('#prison-name-text-input', 'Hewell')
      .click('#NameOfPrison') // click label to remove input focus
      .click('#about-the-prisoner-submit')

      // About you
      .waitForExist('#about-you-submit')

      .setValue('#first-name-input', 'Joe')
      .setValue('#last-name-input', 'Bloggs')
      .setValue('#national-insurance-number-input', 'TS876541T')
      .setValue('#house-number-and-street-input', '1')
      .setValue('#town-input', 'Town')
      .setValue('#county-input', 'County')
      .setValue('#post-code-input', 'AA123AA')
      .selectByVisibleText('#country-input', 'England')
      .setValue('#email-address-input', 'donotsend@apvs.com')
      .setValue('#phone-number-input', '0123456789')
      .click('#about-you-submit')

      // Future or past visit
      .waitForExist('#future-or-past-submit')
      .click('[for="past"]')
      .click('#future-or-past-submit')

      // Journey information
      .waitForExist('#journey-information-submit')
      .setValue('#date-of-journey-day', todaysDate.date())
      .setValue('#date-of-journey-month', todaysDate.month() + 1)
      .setValue('#date-of-journey-year', todaysDate.year())
      .click('#journey-information-submit')

      // Has Escort
      .waitForExist('#has-escort-submit')
      .click('[for="escort-yes"]')
      .click('#has-escort-submit')

      // Escort
      .waitForExist('#about-escort-submit')
      .setValue('#first-name-input', 'Frank')
      .setValue('#last-name-input', 'Smith')
      .setValue('#dob-day', '15')
      .setValue('#dob-month', '07')
      .setValue('#dob-year', '1985')
      .click('#about-escort-submit')

      // Has Child
      .waitForExist('#has-child-submit')
      .click('[for="child-yes"]')
      .click('#has-child-submit')

      // About Child #1
      .waitForExist('#about-child-submit')
      .setValue('#first-name-input', 'Sam')
      .setValue('#last-name-input', 'Bloggs')
      .setValue('#dob-day-input', '15')
      .setValue('#dob-month-input', '05')
      .setValue('#dob-year-input', '2014')
      .click('[for="my-child"]')
      .click('[for="add-another-child"]')
      .click('#about-child-submit')

      // Allow second bus page to load
      .pause(3000)

      // About Child #2
      .waitForExist('#about-child-submit')
      .setValue('#first-name-input', 'Lewis')
      .setValue('#last-name-input', 'Bloggs')
      .setValue('#dob-day-input', '20')
      .setValue('#dob-month-input', '12')
      .setValue('#dob-year-input', '2013')
      .click('[for="prisoners-child"]')
      .click('#about-child-submit')

      // Expense
      .waitForExist('#expenses-submit')
      .click('[for="car"]')
      .click('[for="bus"]')
      .click('[for="refreshment"]')
      .click('#expenses-submit')

      // Car
      .waitForExist('#car-details-submit')
      .click('#car-details-submit')

      // Bus #1 (adult expense)
      .waitForExist('#bus-details-submit')
      .click('[for="is-child-ticket"]')
      .setValue('#from-input', 'Euston')
      .setValue('#to-input', 'Birmingham New Street')
      .click('[for="return-no"]')
      .setValue('#cost-input', '20')
      .click('[for="add-another-journey"]')
      .click('#bus-details-submit')

      // Allow second bus page to load
      .pause(3000)

      // Bus #2 (add another journey) (child expense)
      .waitForExist('#bus-details-submit')
      .click('[for="is-escort-ticket"]')
      .setValue('#from-input', 'Birmingham New Street')
      .setValue('#to-input', 'Euston')
      .click('[for="return-no"]')
      .setValue('#cost-input', '20')
      .click('#bus-details-submit')

      // Light refreshment
      .waitForExist('#light-refreshment-details-submit')
      .setValue('#cost-input', '7.99')
      .click('#light-refreshment-details-submit')

      // Claim summary
      .waitForExist('#claim-summary-submit')
      .click('#add-visit-confirmation')

      // Upload visit confirmation
      .waitForExist('#file-upload-submit')
      .chooseFile('#document', TEST_FILE_PATH)
      .getValue('#document')
      .click('#file-upload-submit')

      // Claim summary
      .waitForExist('#claim-summary-submit')
      .click('.add-expense-receipt')

      // Upload Receipt Bus Adult
      .waitForExist('#file-upload-submit')
      .chooseFile('#document', TEST_FILE_PATH)
      .getValue('#document')
      .click('#file-upload-submit')

      // Claim summary
      .waitForExist('#claim-summary-submit')
      .click('.add-expense-receipt')

      // Upload Receipt Bus Child
      .waitForExist('#file-upload-submit')
      .chooseFile('#document', TEST_FILE_PATH)
      .getValue('#document')
      .click('#file-upload-submit')

    // Car journey and light refreshment do not require receipts

      // Claim summary
      .waitForExist('#claim-summary-submit')
      .click('#claim-summary-submit')

      // Choose Payment Method
      .waitForExist('#payment-submit')
      .click('[for="bank"]')
      .click('#payment-submit')

      // Enter Bank Account Details
      .waitForExist('#bank-payment-submit')
      .setValue('#name-on-account-input', 'Joe Bloggs')
      .setValue('#sort-code-input', '001122')
      .setValue('#account-number-input', '00123456')
      .click('#bank-payment-submit')

      // Declaration page
      .waitForExist('#claim-submit')
      .click('[for="terms-and-conditions-input"]')
      .click('#claim-submit')

      // Application submitted
      .waitForExist('#reference')
  })

  after(function () {
    return claimHelper.getRef(caseworker)
      .then(function (reference) {
        return internalEligibilityHelper.deleteAll(reference)
      })
  })
})
