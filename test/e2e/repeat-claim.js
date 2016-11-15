const internalEligibilityHelper = require('../helpers/data/internal/internal-eligibility-helper')

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
      .setValue('#dob-day-input', '01')
      .setValue('#dob-month-input', '05')
      .setValue('#dob-year-input', '1955')
      .click('#already-registered-submit')

      // Your Claims
      .waitForExist('#your-claims-submit')
  })
})
