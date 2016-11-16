const internalEligibilityHelper = require('../helpers/data/internal/internal-eligibility-helper')
const internalVisitorHelper = require('../helpers/data/internal/internal-visitor-helper')

describe('Repeat Claim Flow', function () {
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
      .waitForExist('#your-claims-submit')
  })
})
