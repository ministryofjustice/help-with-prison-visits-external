const eligibilityHelper = require('../helpers/data/eligibility-helper')

// TODO: This won't work as the eligibility created here will never be copied over to the internal database.
describe('Repeat Claim Flow', () => {
  const REFERENCE = 'REP1234'

  before(function () {
    eligibilityHelper.insert(REFERENCE)
  })

  after(function () {
    eligibilityHelper.deleteAll(REFERENCE)
  })

  it('should display each page in the repeat claim flow', () => {
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
