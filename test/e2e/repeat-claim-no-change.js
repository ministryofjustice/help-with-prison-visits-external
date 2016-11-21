const internalEligibilityHelper = require('../helpers/data/internal/internal-eligibility-helper')
const internalVisitorHelper = require('../helpers/data/internal/internal-visitor-helper')
const dateFormatter = require('../../app/services/date-formatter')

var todaysDate = dateFormatter.now()
describe('Repeat claim with no change flow', function () {
  const REFERENCE = 'REP1234'

  before(function () {
    return internalEligibilityHelper.insertEligibilityAndClaim(REFERENCE)
  })

  after(function () {
    return internalEligibilityHelper.deleteAll(REFERENCE)
  })

  it('should display each page in the repeat claim flow', function () {
    return browser.url('/')

      // Index
      .waitForExist('#start')
      .click('#start')

      // Start
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
      .click('[for="confirm-correct"]')
      .click('#continue')

      // Future or past visit
      .waitForExist('#future-or-past-submit')
      .click('[for="past"]')
      .click('#future-or-past-submit')

      // Journey information
      .waitForExist('#journey-information-submit')
      .setValue('#date-of-journey-day', todaysDate.date())
      .setValue('#date-of-journey-month', todaysDate.month() + 1)
      .setValue('#date-of-journey-year', todaysDate.year())
      .click('[for="child-no"]')
      .click('#journey-information-submit')

      // Expense
      .waitForExist('#expenses-submit')
      .click('[for="bus"]')
      .click('#expenses-submit')

      // Bus #1 (adult expense)
      .waitForExist('#bus-details-submit')
      .setValue('#from-input', 'Euston')
      .setValue('#to-input', 'Birmingham New Street')
      .click('[for="return-no"]')
      .click('[for="is-child-no"]')
      .setValue('#cost-input', '20')
      // .click('#bus-details-submit')
  })
})
